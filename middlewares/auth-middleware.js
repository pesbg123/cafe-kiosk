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
  if (!accessToken) {
    return res
      .status(400)
      .json({
        errorMessage: 'AccessToken does not exist Re-login is required.',
      });
  }
  if (!refreshToken) {
    return res
      .status(400)
      .json({
        errorMessage: 'RefreshToken does not exist Re-login is required.',
      });
  }

  try {
    // 액세스 토큰이 만료된 경우
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY);
    // 사용자 인증
    if (decodedAccessToken.hasOwnProperty('userId')) {
      const user = await Users.findOne({
        where: { userId: decodedAccessToken.userId },
      });
      // 유효하지 않은 사용자인 경우
      if (!user) {
        return res.status(400).json({ errorMessage: 'Not a valid user.' });
      }
      res.locals.user = user;
      return next();
    } else {
      return res
        .status(400)
        .json({ errorMessage: 'The AccessToken is invalid.' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          env.REFRESH_TOKEN_KEY
        );

        if (decodedRefreshToken.hasOwnProperty('userId')) {
          const newPayload = { userId: decodedRefreshToken.userId };
          const user = await Users.findOne({
            where: { userId: decodedRefreshToken.userId },
          });
          res.locals.user = user;
          await refreshTokenPair(res, newPayload);
          return next();
        }
      } catch (refreshError) {
        res.locals.user = null;
        res.locals.owner = null;

        res.clearCookie('accessToken', { httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });
        return res.status(401).json({ errorMessage: 'Re-login is required.' });
      }
    }
  }
};

module.exports = authMiddleware;
