const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();
const env = process.env;

module.exports = async (req, res, next) => {
  // accessToken 발급
  const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_KEY, {
      expiresIn: '1h',
    });
  };
  // refreshToken 발급
  const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_KEY, {
      expiresIn: '7d',
    });
  };
  // refreshToken 재생성
  const refreshTokenPair = async (res, payload) => {
    const newAccessToken = generateAccessToken(payload);
    // 쿠키에 액세스 토큰 저장
    res.cookie('accessToken', newAccessToken, { httpOnly: true });
  };

  const authMiddleware = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    // accessToken과 refreshToken이 없을 경우
    if (!accessToken) {
      return res
        .status(400)
        .json({ errorMessage: 'AccessToken does not exist.' });
    }
    if (!refreshToken) {
      return res
        .status(400)
        .json({ errorMessage: 'RefreshToken does not exist.' });
    }

    try {
      // accessToken이 만료되었을 경우
      const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY);
      // 사용자 인증
      if (decodedAccessToken.hasOneProperty('userId')) {
        const user = await Users.findOne({
          where: { userId: decodedAccessToken.userId },
        });
        // 유효한 사용자가 아닐 경우
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
          return res
            .status(401)
            .json({ errorMessage: '재로그인이 필요합니다.' });
        }
      }
    }
  };
};

module.exports = authMiddleware;
