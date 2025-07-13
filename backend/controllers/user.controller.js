import uploadMongo from "../models/User.model.js";
import parseFile from "../utils/parseFile.js";

export async function uploadFile(req, res) {
  try {
    const { originalname, mimetype, buffer, size } = req.file;

    let parsedContent = null;
    if (mimetype === 'application/pdf') {
      try {
        parsedContent = await parseFile(buffer);
      } catch (parseError) {
        console.error('PDF parsing failed:', parseError);
      }
    }

    const newFile = await uploadMongo.create({
      filename: originalname,
      mimetype,
      buffer,
      size,
      parsedText: parsedContent?.text || null,
    });

    res.status(200).json({
      message: "Data added in MongoDB successfully",
      file: {
        id: newFile._id,
        filename: newFile.filename,
        mimetype: newFile.mimetype,
        size: newFile.size,
        parsedText: parsedContent?.text ? 'Available' : 'Not available',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: "Failed to upload file",
      message: error.message,
    });
  }
}

