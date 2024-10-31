const express = require('express');
const cors = require('cors'); // CORS 패키지 추가
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const boardRoutes = require('./routes/board');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// CORS 설정
app.use(cors());
// 특정 도메인만 허용하고 싶다면 다음과 같이 설정
//app.use(cors({ origin: 'http://your-frontend-domain.com' }));

// 미들웨어
app.use(bodyParser.json());

// 라우트
app.use('/board', boardRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
