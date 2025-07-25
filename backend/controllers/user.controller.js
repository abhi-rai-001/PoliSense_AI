import uploadMongo from "../models/User.model.js";
import pdf from "pdf-extraction";
import mammoth from "mammoth";
import { simpleParser } from "mailparser";
import { splitTextIntoChunks } from "../utils/splitText.js";
import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function uploadFile(req, res) {
  try {
    try {
      await uploadMongo.deleteMany({});
      await axios.delete(`${PYTHON_SERVICE_URL}/clear_all_documents`);
      console.log("Cleared previous documents before upload");
    } catch (clearError) {
      console.error("Failed to clear previous documents:", clearError.message);
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const isEmailText = req.body.isEmailText === "true";
    const userId = req.body.userId || "anonymous";
    
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
    
    const newFile = await uploadMongo.create({
      filename: originalname,
      mimetype: isEmailText ? 'text/email' : mimetype,
      buffer,
      size,
      parsedText: parsedText || null,
      userId: userId,
    });

    if (parsedText) {
      try {
        await axios.post(`${PYTHON_SERVICE_URL}/add_document`, {
          doc_id: newFile._id.toString(),
          content: parsedText,
          filename: originalname,
          user_id: userId,
          document_type: mimetype === 'application/pdf' ? 'PDF' : 
                        mimetype.includes('word') ? 'DOCX' : 
                        mimetype === 'text/email' ? 'Email' : 'Unknown'
        });
        console.log("Document sent to vector database with metadata");
      } catch (vectorError) {
        console.error('Vector embedding failed:', vectorError.message);
      }
    }

    res.status(200).json({
      message: "Content uploaded successfully",
      file: {
        id: newFile._id,
        filename: newFile.filename,
        mimetype: newFile.mimetype,
        size: newFile.size,
        parsedText: parsedText ? 'Available' : 'Not available',
      },
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: "Failed to upload content",
      message: error.message,
    });
  }
}

export async function queryDocuments(req, res) {
  try {
    const { question } = req.body;
    const userId = req.body.userId || "anonymous";
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await axios.post(`${PYTHON_SERVICE_URL}/query`, {
      question: question,
      user_id: userId
    });

    const responseData = response.data;
    
    res.status(200).json({
      Decision: responseData.Decision,
      Amount: responseData.Amount,
      Justification: responseData.Justification,
      answer: responseData.answer || responseData.Justification?.Summary || "No answer available",
      sources: responseData.sources || []
    });

  } catch (error) {
    console.error('Query error:', error);
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
    console.log("Clearing all documents...");
    
    const mongoResult = await uploadMongo.deleteMany({});
    console.log(`Deleted ${mongoResult.deletedCount} documents from MongoDB`);
    
    try {
      const pythonResponse = await axios.delete(`${PYTHON_SERVICE_URL}/clear_all_documents`);
      console.log("Python service response:", pythonResponse.data);
    } catch (pythonError) {
      console.error("Python service error:", pythonError.response?.data || pythonError.message);
    }
    
    res.status(200).json({ 
      message: "All documents cleared successfully",
      documentsDeleted: mongoResult.deletedCount
    });
    
  } catch (error) {
    console.error('Clear all documents error:', error);
    res.status(500).json({
      error: "Failed to clear all documents",
      message: error.message
    });
  }
}
