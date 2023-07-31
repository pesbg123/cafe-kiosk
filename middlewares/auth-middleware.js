const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();
const env = process.env;

// 액세스 토큰 생성 함수
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_KEY, {
    expiresIn: '1h',
  });
};

// 리프레시 토큰 생성 함수
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d',
  });
};

// 리프레시 토큰 재생성 함수
const refreshTokenPair = async (res, payload) => {
  const newAccessToken = generateAccessToken(payload);
  // 새로운 액세스 토큰을 쿠키에 저장
  res.cookie('accessToken', newAccessToken, { httpOnly: true });
};

const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  // 액세스 토큰과 리프레시 토큰이 없는 경우
  if (!accessToken || !refreshToken) {
    return res
      .status(401)
      .json({ errorMessage: 'Unauthorized. Re-login is required.' });
  }

  try {
    // 액세스 토큰 확인
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY);
    const userId = decodedAccessToken.userId;
    const user = await Users.findOne({ where: { userId } });

    // 유효하지 않은 사용자인 경우
    if (!user) {
      return res.status(401).json({ errorMessage: 'Not a valid user.' });
    }

    res.locals.user = user;
    return next();
  } catch (accessTokenError) {
    if (accessTokenError.name === 'TokenExpiredError') {
      try {
        // 리프레시 토큰 확인
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          env.REFRESH_TOKEN_KEY
        );
        const userId = decodedRefreshToken.userId;
        const user = await Users.findOne({ where: { userId } });

        // 유효하지 않은 리프레시 토큰인 경우
        if (!user) {
          throw new Error('Invalid refresh token.');
        }

        // 액세스 토큰과 리프레시 토큰 재생성
        const newPayload = { userId };
        res.locals.user = user;
        await refreshTokenPair(res, newPayload);
        return next();
      } catch (refreshTokenError) {
        res.locals.user = null;
        res.clearCookie('accessToken', { httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });
        return res
          .status(401)
          .json({ errorMessage: 'Unauthorized. Re-login is required.' });
      }
    } else {
      res.locals.user = null;
      res.clearCookie('accessToken', { httpOnly: true });
      res.clearCookie('refreshToken', { httpOnly: true });
      return res
        .status(401)
        .json({ errorMessage: 'Unauthorized. Re-login is required.' });
    }
  }
};

module.exports = authMiddleware;
