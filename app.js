const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const authRouter = require('./routes/auth.js');
const productRouter = require('./routes/products.js');

app.use(express.json()); // json 파싱
app.use(cookieParser()); // 쿠키 파싱

// 라우터들을 가져옵니다.
app.use('/api', [authRouter, productRouter]);

// 404에러 캐치 미들웰어
app.use((req, res, next) => {
  res.status(404).send('The API request path is incorrect.');
});

// 전역 에러 캐치 미들웨어
app.use((error, req, res, next) => {
  // status 코드와 에러 메세지를 포함하여 응답합니다.
  res.status(500).json({ errorMessage: error.errorMessage });
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
