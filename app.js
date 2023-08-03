const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const authRouter = require('./routes/auth.routes.js');
const productRouter = require('./routes/products.routes.js');
const productOrderRouter = require('./routes/product-orders.routes.js');

app.use(express.json()); // json 파싱
app.use(cookieParser()); // 쿠키 파싱

// 라우터들을 가져옵니다.
app.use('/api', [authRouter, productRouter, productOrderRouter]);

// 잘못된 API 경로로 요청이 왔을시 에러를 보냄
app.use((req, res, next) => {
  res.status(404).send('The API request path is incorrect.');
});

// 전역 에러 캐치 미들웨어
app.use((error, req, res, next) => {
  res.json({ errorMessage: error.errorMessage });
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
