const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입 라우트
router.post('/register', authController.register);

// 로그인 라우트
router.post('/login', authController.login);

// 로그아웃 요청 (리프레시 토큰 무효화)
router.post('/logout', authController.logout);

// 토큰 재발급
router.post('/reToken', authController.reToken);

module.exports = router;
