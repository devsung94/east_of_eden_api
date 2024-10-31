const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// JWT 토큰을 검증하는 미들웨어
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(400).json({ message: 'Token required' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log('err',err);
      console.log('user',user);

      if (err){ 
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired', err: err });
        }
        return res.status(403).json({ message: 'Invalid token', err:err });
      }
      req.user = user.mb_id;
      next();
    });
}

module.exports = authenticateToken;