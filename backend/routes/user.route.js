import express from 'express';
import { uploadFile, queryDocuments, clearAllDocuments } from '../controllers/user.controller.js';
import { upload } from '../config/multer.config.js';
const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.post('/query', queryDocuments);
router.delete('/clear-all-documents', clearAllDocuments);

export default router;
