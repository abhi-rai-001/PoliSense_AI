import { supabase } from "../lib/supabase.js";
import pdf from "pdf-extraction";
import mammoth from "mammoth";
import { simpleParser } from "mailparser";
import { splitTextIntoChunks } from "../utils/splitText.js";
import { addDocumentToVectorStore, queryVectorStore, clearUserDocumentsFromVectorStore } from "../lib/rag.js";

export async function uploadFile(req, res) {
  try {
    const { file, body } = req;
    const { buffer, mimetype, originalname, size } = file;
    const { userId, isEmailText } = body;

    // Ensure we have a valid Clerk user ID
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(`📁 Upload request - User: ${userId}, File: ${originalname}, Type: ${mimetype}`);

    // Clear previous documents first
    try {
      const { error: deleteError } = await supabase.from('user_documents').delete().eq('user_id', userId);
      if (deleteError) throw deleteError;
      await clearUserDocumentsFromVectorStore(userId);
      console.log("✅ Cleared previous documents before upload");
    } catch (clearError: any) {
      console.error("❌ Failed to clear previous documents:", clearError.message);
    }

    let parsedText = null;
    
    if (isEmailText && mimetype === 'text/plain') {
      try {
        const emailContent = buffer.toString('utf-8');
        
        if (emailContent.includes('From:') || emailContent.includes('Subject:')) {
          const lines = emailContent.split('\n');
          let subject = '', from = '', to = '', date = '', body = '';
          let bodyStart = false;
          
          lines.forEach(line => {
            if (line.startsWith('Subject:')) subject = line.substring(8).trim();
            else if (line.startsWith('From:')) from = line.substring(5).trim();
            else if (line.startsWith('To:')) to = line.substring(3).trim();
            else if (line.startsWith('Date:')) date = line.substring(5).trim();
            else if (line.trim() === '' && !bodyStart) bodyStart = true;
            else if (bodyStart) body += line + '\n';
          });
          
          parsedText = `
Subject: ${subject || 'No subject'}
From: ${from || 'Unknown sender'}
To: ${to || 'Unknown recipient'}
Date: ${date || 'Unknown date'}

Body:
${body.trim() || emailContent}
          `.trim();
        } else {
          parsedText = emailContent;
        }
      } catch (parseError) {
        console.error('Email text parsing failed:', parseError);
        parsedText = buffer.toString('utf-8');
      }
    }
    
    else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        parsedText = result.value;
      } catch (parseError) {
        console.error('DOCX parsing failed:', parseError);
        parsedText = "DOCX parsing failed";
      }
    }
    
    else if (mimetype === 'message/rfc822' || originalname.toLowerCase().endsWith('.eml')) {
      try {
        const parsed = await simpleParser(buffer);
        parsedText = `
Subject: ${parsed.subject || 'No subject'}
From: ${parsed.from?.text || 'Unknown sender'}
To: ${parsed.to?.text || 'Unknown recipient'}
Date: ${parsed.date || 'Unknown date'}

Body:
${parsed.text || parsed.html || 'No content'}
        `.trim();
      } catch (parseError) {
        console.error('EML parsing failed:', parseError);
        parsedText = "EML parsing failed";
      }
    }
    
    else if (mimetype === 'application/pdf') {
      try {
        const pdfData = await pdf(buffer);
        parsedText = pdfData.text || "PDF text extraction failed";
      } catch (parseError) {
        console.error('PDF parsing failed:', parseError);
        parsedText = "PDF parsing failed";
      }
    }
    
    const { data: newFile, error: insertError } = await supabase.from('user_documents').insert({
      filename: originalname,
      mimetype: isEmailText ? 'text/email' : mimetype,
      size,
      parsed_text: parsedText || null,
      user_id: userId,
    }).select().single();

    if (insertError) {
      throw insertError;
    }

    console.log(`💾 Saved to Supabase - ID: ${newFile.id}, User: ${userId}`);

    if (parsedText) {
      try {
        console.log(`🔄 Sending to vector DB - User: ${userId}, Content length: ${parsedText.length}`);
        
        // Chunk the text using the existing utility
        const chunks = splitTextIntoChunks(parsedText, 1000, 200);
        
        const chunksAdded = await addDocumentToVectorStore(parsedText, userId, chunks);
        
        console.log(`✅ Vector DB response: Successfully added ${chunksAdded} chunks`);
      } catch (vectorError: any) {
        console.error('❌ Vector embedding failed:', vectorError.message);
      }
    }

    res.status(200).json({
      message: "Content uploaded successfully",
      file: {
        id: newFile.id,
        filename: newFile.filename,
        mimetype: newFile.mimetype,
        size: newFile.size,
        parsedText: parsedText ? 'Available' : 'Not available',
        userId: userId
      },
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      error: "Failed to upload content",
      message: error.message,
    });
  }
}

export async function queryDocuments(req, res) {
  try {
    const question = req.body.query || req.body.question;
    const userId = req.body.userId;
    
    // Ensure we have a valid Clerk user ID
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    console.log(`🔍 Query request - User: ${userId}, Question: "${question}"`);
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Check if user has documents in MongoDB
    const { count: mongoCount } = await supabase
      .from('user_documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    console.log(`📊 Supabase documents for user ${userId}: ${mongoCount}`);

    const response = await queryVectorStore(question, userId);
    console.log(`🤖 RAG response for user ${userId}:`, response);

    let responseData = response;
    let parsedData: any = {};
    
    try {
      // Find JSON block in the text
      const jsonMatch = responseData.text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || responseData.text.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback if no json match but text is valid json
        parsedData = JSON.parse(responseData.text);
      }
    } catch (e) {
      console.error("Failed to parse Gemini output as JSON", e);
      parsedData = { justification: responseData.text }; // fallback
    }

    const finalDecision = parsedData.decision || parsedData.Decision || "Information Only";
    const finalAmount = parsedData.amount || parsedData.Amount || "Not applicable";
    const finalJustification = {
      Summary: parsedData.justification || parsedData.Justification?.Summary || responseData.text,
      Clauses: parsedData.relevant_clauses || parsedData.Justification?.Clauses || []
    };

    // Convert string clauses to object format for frontend
    if (finalJustification.Clauses && Array.isArray(finalJustification.Clauses)) {
      finalJustification.Clauses = finalJustification.Clauses.map((clause, index) => {
        if (typeof clause === 'string') {
          // Extract key terms for better reference names
          const keyTerms = clause.toLowerCase().match(/\b(encryption|privacy|security|data|user|right|policy|deletion|storage)\b/g);
          const referenceName = keyTerms && keyTerms.length > 0 
            ? `${keyTerms[0].charAt(0).toUpperCase() + keyTerms[0].slice(1)} Section`
            : `Document Section ${index + 1}`;
          
          return {
            Reference: referenceName,
            Text: clause
          };
        }
        return clause;
      });
    }

    res.status(200).json({
      Decision: finalDecision,
      Amount: finalAmount,
      Justification: finalJustification,
      answer: finalJustification.Summary,
      sources: responseData.sources || []
    });

  } catch (error) {
    console.error('❌ Query error:', error);
    res.status(500).json({
      Decision: "Information Only",
      Amount: "Not applicable", 
      Justification: {
        Summary: "Failed to process your request due to technical difficulties.",
        Clauses: [{
          Reference: "System Error",
          Text: "Please try again or contact support if the issue persists"
        }]
      },
      error: "Failed to query documents",
      message: error.response?.data?.detail || error.message,
    });
  }
}

export async function clearAllDocuments(req, res) {
  try {
    const userId = req.body.userId;
    
    // Ensure we have a valid Clerk user ID
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    console.log(`Clearing documents for user: ${userId}`);
    
    // Clear user-specific documents from Supabase
    const { error: deleteError } = await supabase.from('user_documents').delete().eq('user_id', userId);
    if (deleteError) throw deleteError;
    console.log(`Deleted documents from Supabase for user ${userId}`);
    
    // Clear user-specific documents from Pinecone
    try {
      await clearUserDocumentsFromVectorStore(userId);
      console.log("Pinecone service documents cleared.");
    } catch (pythonError: any) {
      console.error("Pinecone service error:", pythonError.message);
    }
    
    res.status(200).json({ 
      message: `Documents cleared successfully for user ${userId}`,
      documentsDeleted: "all"
    });
    
  } catch (error) {
    console.error('Clear documents error:', error);
    res.status(500).json({
      error: "Failed to clear documents",
      message: error.message
    });
  }
}
