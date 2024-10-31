const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

let refreshTokens = []; // 리프레시 토큰 저장

// 로그인
exports.login = async (req, res) => {
  const { mb_id, mb_password } = req.body;
  console.log(mb_id,mb_password);

  try {
    const [rows] = await pool.query('SELECT * FROM member WHERE mb_id = ?', [mb_id]);
    if (rows.length === 0) {
      return res.status(400).json({ msg: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const user = rows[0];
    
    // 비밀번호 확인
    const isMatch = await bcrypt.compare(mb_password, user.mb_password);
    if (!isMatch) {
      return res.status(400).json({ msg: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // 액세스 토큰과 리프레시 토큰 발급
    const accessToken = jwt.sign({ mb_id: user.mb_id }, process.env.JWT_SECRET, { expiresIn: '2h', algorithm: 'HS256' }); // 15분 유효
    const refreshToken = jwt.sign({ mb_id: user.mb_id }, process.env.RE_JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' }); // 7일 유효

    refreshTokens.push(refreshToken);
    console.log("refreshTokens :",refreshTokens);
    res.status(200).json({ accessToken:accessToken, refreshToken:refreshToken });
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 토큰 재발급
exports.reToken = async (req, res) => {
  const { reToken } = req.body;
  console.log("reToken : ",req.body);

  if (!reToken) return res.status(401).json({ message: 'Token required' });
  if (!refreshTokens.includes(reToken)) return res.status(403).json({ message: 'Invalid refresh token' });

  jwt.verify(reToken, process.env.RE_JWT_SECRET, (err, user) => {
    console.log('reToken err : ',err);
    if (err){
      refreshTokens = refreshTokens.filter(t => t !== reToken); // 리프레시 토큰 삭제
      console.log('reToken refreshTokens : ',refreshTokens);
      return res.status(403).json({ message: 'Invalid token'});
    } 

    // 유효한 리프레시 토큰일 경우 새로운 액세스 토큰 발급
    const accessToken = jwt.sign({ mb_id: user.mb_id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    console.log('토큰 재발급 성공! ',accessToken);
    res.json({ accessToken });
  });
};

// 회원가입
exports.register = async (req, res) => {
  const { mb_id, mb_password, mb_name, mb_nick, mb_hp } = req.body;

  try {
    // 아이디 중복 확인
    const [rows] = await pool.query('SELECT mb_id FROM member WHERE mb_id = ?', [mb_id]);
    if (rows.length > 0) {
      return res.status(400).json({ msg: '이미 존재하는 아이디입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(mb_password, 10);

    // 사용자 저장
    await pool.query('INSERT INTO member (mb_id, mb_password, mb_name, mb_nick, mb_hp) VALUES (?, ?, ?, ?, ?)'
                    , [mb_id, hashedPassword, mb_name, mb_nick, mb_hp]);
    
    res.status(201).json({ msg: '회원가입 성공!' });
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

exports.logout = async (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token); // 리프레시 토큰 삭제
  console.log('logout!! refreshTokens : ',refreshTokens);
  res.sendStatus(204);
}

