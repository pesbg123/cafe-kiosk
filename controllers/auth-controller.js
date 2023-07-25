const AuthService = require('../services/auth-service');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }
  // 회원가입
  async signup(req, res, next) {
    try {
      const { username, password, confirmPassword, is_admin } = req.body; // body에서 회원가입에 필요한 정보 받아오기
      // 데이터가 비어있는지 확인
      if (!username || !password || !confirmPassword) {
        res
          .status(400)
          .json({ errorMessage: 'Please enter your username or password' });
      }
      // signup메서드 호출 후 리턴값 message 변수에 할당
      const message = await this.authService.signup(
        username,
        password,
        confirmPassword,
        is_admin
      );

      // 확인 응답
      res.status(200).json(message.message);
    } catch (error) {
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 로그인
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const { refreshToken, accessToken } = req.cookies;

      await this.authService.login(
        username,
        password,
        refreshToken,
        accessToken,
        res
      );
    } catch (error) {
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 로그아웃
  async logout(req, res, next) {
    try {
      await this.authService.logout(res);
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }
}

module.exports = AuthController;
