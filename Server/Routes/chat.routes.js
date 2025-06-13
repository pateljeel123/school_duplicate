const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const chatController = require('../Controllers/chat.Controller');

// Multer config for file uploads with disk storage
const diskStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadToDisk = multer({ storage: diskStorage });

// Student chat routes
router.post('/student', uploadToDisk.single('image'), chatController.studentChat);
router.get('/student/history', chatController.getStudentChatHistory);
router.delete('/student/history', chatController.clearStudentChatHistory);

// Teacher chat routes
router.post('/teacher', chatController.teacherChat);
router.get('/teacher/history', chatController.getTeacherChatHistory);
router.delete('/teacher/history', chatController.clearTeacherChatHistory);

module.exports = router;