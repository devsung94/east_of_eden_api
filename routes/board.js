const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authenticateToken = require('../middleware/authenticateToken');

// 기능 페이지 (액세스 토큰 인증 필요)
router.get('/posts', authenticateToken, boardController.list);
// router.get('/posts', boardController.list);
router.post('/posts', authenticateToken, boardController.create);
router.put('/posts/:bo_idx', authenticateToken, boardController.update);
router.delete('/posts/:bo_idx', authenticateToken, boardController.delete);

module.exports = router;
