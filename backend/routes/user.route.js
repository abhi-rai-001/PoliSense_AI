import express from 'express';
import { uploadFile } from '../controllers/user.controller.js';
import { upload } from '../config/multer.config.js';
const router = express.Router();

router.post('/upload',upload.single('file'), uploadFile);

export default router;
