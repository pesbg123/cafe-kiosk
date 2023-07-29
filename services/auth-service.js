const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;
const saltRounds = 10;
const AuthRepository = require('../repositories/auth-repository');

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }
  // 회원가입
  async signup(userName, password, confirmPassword, is_admin) {
    const userNameRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    // 정규식을 사용해 userName이 올바른 양식인지 검증 (글자와 숫자 포함)
    if (!userNameRegex.test(userName)) {
      throw new Error(
        'The userName must contain at least one letter and one number.'
      );
    }
    // 정규식을 사용해 password가 올바른 양식인지 검증 (4글자 이상 특수기호 포함)
    if (!passwordRegex.test(password)) {
      throw new Error(
        'Password must be at least 4 characters long and contain at least one number and one special character.'
      );
    }
    // password가 confirmPassword와 일치하는지 검증
    if (password !== confirmPassword) {
      throw new Error('The password and confirm password do not match.');
    }
    // userName이 password안에 포함되는지 검증
    if (userName.includes(password) || password.includes(userName)) {
      throw new Error('The userName cannot be included in the password.');
    }
    // userName 중복을 위해 db에 조회
    const DuplicateuserName = await this.authRepository.findByuserName(
      userName
    );
    // userName 유효성 검증
    if (DuplicateuserName) {
      throw new Error('The userName is already in use.');
    }
    // 비밀번호 암호화
    const EncryptionPassword = await bcrypt.hash(password, saltRounds);
    // 유저를 저장하기 위해 createUser메서드 호출하는 동시에 변수에 할당
    const message = await this.authRepository.createUser(
      userName,
      EncryptionPassword,
      is_admin
    );
    return message;
  }

  // 로그인
  async login(userName, password, refreshToken, accessToken, res) {
    // 액세스 토큰 발급
    const generateAccessToken = (userId) => {
      return jwt.sign({ userId: userId }, env.ACCESS_TOKEN_KEY, {
        expiresIn: '1h',
      });
    };

    // 리프레시 토큰 발급
    const generateRefreshToken = (userId) => {
      return jwt.sign({ userId: userId }, env.REFRESH_TOKEN_KEY, {
        expiresIn: '7d',
      });
    };
    let newAccessToken;
    let newRefreshToken;

    const thisUser = await this.authRepository.findByuserName(userName); // 닉네임 기준 사용자 정보 조회

    // nickname과 일치하는 유저가 없을 경우
    if (thisUser === null) {
      throw new Error('Password or userName does not match.');
    }

    // db에서 받은 유저 패스워드랑 일치하는지 검증
    const MatchPassword = await bcrypt.compare(
      password,
      thisUser.dataValues.password
    );

    // password를 잘못 입력했을때
    if (!MatchPassword) {
      throw new Error('Password or userName does not match.');
    }
    // 토큰이 없을때
    if (!refreshToken || !accessToken) {
      // 비밀번호 디코딩 후 유효성 검증
      const comparePassword = await bcrypt.compare(password, thisUser.password);
      if (!comparePassword) {
        throw new Error('The password does not match.');
      }
      // 액세스 토큰과 리프레쉬 토큰 발급 + 쿠키에 저장 + 응답
      newAccessToken = generateAccessToken(thisUser.userId);
      newRefreshToken = generateRefreshToken(thisUser.userId);
    }
    return res
      .cookie('accessToken', newAccessToken, { httpOnly: true })
      .cookie('refreshToken', newRefreshToken, { httpOnly: true })
      .status(200)
      .json({
        message: 'Login successful!',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
  }

  // 로그아웃
  async logout(res) {
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });
    res.json({ message: 'Logout successful!' });
  }
}

module.exports = AuthService;
