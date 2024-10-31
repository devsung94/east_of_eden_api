const pool = require('../config/db');

exports.list = async (req, res) => {
    try {
        const mbti_type = req.query.mbti_type;
        const page = parseInt(req.query.page) || 1; // 클라이언트로부터 페이지 번호를 받아옴, 기본값은 1
        const limit = 10; // 페이지당 표시할 항목 수
        const offset = (page - 1) * limit; // 오프셋 계산

        const [rows] = await pool.query(
            'SELECT * FROM mbti_board WHERE mbti_type = ? LIMIT ? OFFSET ?',
            [mbti_type, limit, offset]
        );
        // 전체 게시글 수를 계산하여 더 많은 게시글이 있는지 확인
        const [totalRows] = await pool.query(
            'SELECT COUNT(*) as count FROM mbti_board WHERE mbti_type = ?',
            [mbti_type]
        );
        const totalCount = totalRows[0].count;

        // console.log(rows,page);
        res.json(rows);
        // res.json({
        //     data: rows,
        //     currentPage: page,
        //     totalPages: Math.ceil(totalCount / limit), // 전체 페이지 수 계산
        //     hasMore: (page * limit) < totalCount // 다음 페이지가 있는지 여부
        // });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.create = async (req, res) => {
    try {
        const {mb_id, title, content, mbti_type } = req.body;
        // 사용자 저장
        const [result] = await pool.query(
            'INSERT INTO mbti_board (mb_id,title, content, mbti_type) VALUES (?, ?, ?, ?)', 
            [mb_id, title, content, mbti_type]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found');
        }

        // 사용자 정보가 있을 경우 해당 정보 반환
        res.status(200).json({ bo_idx:bo_idx });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.update = async (req, res) => {
    try {
        const bo_idx = req.params.bo_idx;
        const { title, content, mbti_type} = req.body;
        console.log('update ',req.body);
        // 사용자 저장
        const [result] = await pool.query(
            'UPDATE mbti_board SET title = ?, content = ?, mbti_type = ?, updated_at = now() WHERE bo_idx = ? ', 
            [title, content, mbti_type, bo_idx]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found');
        }

        // 사용자 정보가 있을 경우 해당 정보 반환
        res.status(200).json({ bo_idx:bo_idx });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.delete = async (req, res) => {
    try {
        const bo_idx = req.params.bo_idx;
        console.log('delete ',req.body);
        // 사용자 저장
        const [result] = await pool.query('DELETE FROM mbti_board WHERE bo_idx = ? ', [bo_idx]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found');
        }

        // 사용자 정보가 있을 경우 해당 정보 반환
        res.status(200).json({ msg: 'mbti 게시글 삭제 성공!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};