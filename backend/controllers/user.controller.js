import uploadMongo from "../models/User.model.js";
import pdf from "pdf-extraction";
import mammoth from "mammoth";
import { simpleParser } from "mailparser";

export async function uploadFile(req, res) {
  try {
    const { originalname, mimetype, buffer, size } = req.file;
    const isEmailText = req.body.isEmailText === "true";
    
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
        
        console.log("Email text parsed successfully");
      } catch (parseError) {
        console.error('Email text parsing failed:', parseError);
        parsedText = buffer.toString('utf-8');
      }
    }
    
    else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        parsedText = result.value;
        console.log("DOCX text extracted:", parsedText.substring(0, 200) + "...");
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
        console.log("EML parsed successfully");
      } catch (parseError) {
        console.error('EML parsing failed:', parseError);
        parsedText = "EML parsing failed";
      }
    }
    
    else if (mimetype === 'application/pdf') {
      parsedText = "PDF parsing not implemented yet";
      console.log("PDF file received, parsing skipped");
    }
    
    const newFile = await uploadMongo.create({
      filename: originalname,
      mimetype: isEmailText ? 'text/email' : mimetype,
      buffer,
      size,
      parsedText: parsedText || null,
    });

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
