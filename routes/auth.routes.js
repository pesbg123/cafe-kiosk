const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth-controller');
const authController = new AuthController();

// 회원가입
router.post('/signup', authController.signup.bind(authController));

// 로그인
router.post('/login', authController.login.bind(authController));

// 로그아웃
router.post('/logout', authController.logout.bind(authController));

module.exports = router;
