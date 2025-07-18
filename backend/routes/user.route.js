import express from 'express';
import { uploadFile, queryDocuments } from '../controllers/user.controller.js';
import { upload } from '../config/multer.config.js';
const router = express.Router();

router.post('/upload',upload.single('file'), uploadFile);
router.post('/query', queryDocuments);

export default router;
