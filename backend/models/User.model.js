import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  filename: String,
  mimetype: String,
  buffer: Buffer,
  size: Number,
  parsedText: String, // Store extracted text content
}, { timestamps: true }
)

const uploadedFile = mongoose.model('user',userSchema);

export default uploadedFile;