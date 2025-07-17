import uploadMongo from "../models/User.model.js";
import pdf from "pdf-extraction";
import mammoth from "mammoth";
import { simpleParser } from "mailparser";

export async function uploadFile(req, res) {
  try {
    const { originalname, mimetype, buffer, size } = req.file;
    let data = null;
    if (mimetype === "application/pdf") {
      try {
        const data = await pdf(buffer);
        console.log(data.text);
      } catch (parseError) {
        console.error("PDF parsing failed:", parseError);
      }
    } else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        data = result.value;
        console.log(
          "Data from Docx parsed successfully",
          data.substring(0, 200)
        );
      } catch (parseError) {
        console.error("Docx parsing failed:", parseError);
      }
    } else if (mimetype === "message/rfc822" || originalname.toLowerCase().endsWith('.eml')) {
      try {
        const parsed = await simpleParser( buffer );
         parsedText = `
Subject: ${parsed.subject || 'No subject'}
From: ${parsed.from?.text || 'Unknown sender'}
To: ${parsed.to?.text || 'Unknown recipient'}
Date: ${parsed.date || 'Unknown date'}
Body:
${parsed.text || parsed.html || 'No content'}
        `.trim();
        console.log(
          "Data from Docx parsed successfully",
          data.substring(0, 200)
        );
      } catch (parseError) {
        console.error("Docx parsing failed:", parseError);
      }
    }

    const newFile = await uploadMongo.create({
      filename: originalname,
      mimetype,
      buffer,
      size,
      parsedText: data?.text || null,
    });

    res.status(200).json({
      message: "Data added in MongoDB successfully",
      file: {
        id: newFile._id,
        filename: newFile.filename,
        mimetype: newFile.mimetype,
        size: newFile.size,
        parsedText: data?.text ? "Available" : "Not available",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Failed to upload file",
      message: error.message,
    });
  }
}
