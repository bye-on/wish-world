const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");   
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('src/content'));
app.get('/', (req, res) => {
    res.send(`<h2>welcome to server</h2>`);
});

app.listen(port, ()=> {
    console.log(`servere 실행 ${port}`);
});

const db = mysql.createConnection({
    host: "localhost",
    user: "wishlover",
    password: "ilovewish",
    database: "homepage"
});

db.connect(err => {
    if(err) console.error("mysql 연결 실패: ", err);
    else console.log("mysql 연결 성공!!");
});

// 📌 [1] 게시글 작성 API
app.post("/diarys", (req, res) => {
    const { content, author } = req.body;
    const sql = "INSERT INTO diarys (content, author) VALUES (?, ?)";
    db.query(sql, [content, author], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

// 📌 [2] 게시글 목록 조회 API
app.get("/diarys", (req, res) => {
    db.query("SELECT * FROM diarys ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 [3] 특정 게시글 조회 + 댓글 포함 API
app.get("/diarys/:id", (req, res) => {
    const diaryId = req.params.id;

    // 게시글 조회
    db.query("SELECT * FROM diarys WHERE id = ?", [diaryId], (err, diary) => {
        if (err) return res.status(500).json({ error: err.message });
        if (diary.length === 0) return res.status(404).json({ error: "게시글 없음" });

        // 댓글 조회
        db.query("SELECT * FROM comments WHERE diary_id = ? ORDER BY COALESCE(parent_id, id), created_at", [diaryId], (err, comments) => {
            if (err) return res.status(500).json({ error: err.message });

            // 댓글 + 답글 정리
            const commentTree = {};
            comments.forEach(comment => {
                if (!comment.parent_id) {
                    commentTree[comment.id] = { ...comment, replies: [] };
                } else {
                    if (commentTree[comment.parent_id]) {
                        commentTree[comment.parent_id].replies.push(comment);
                    }
                }
            });

            res.json({ diary: diary[0], comments: Object.values(commentTree) });
        });
    });
});

// 📌 [4] 댓글 & 답글 작성 API
app.post("/comments", (req, res) => {
    const { diary_id, parent_id, content, author } = req.body;
    const sql = "INSERT INTO comments (diary_id, parent_id, content, author) VALUES (?, ?, ?, ?)";
    db.query(sql, [diary_id, parent_id || null, content, author], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

app.get("/comments/:postId", (req, res) => {
    const sql = "SELECT * FROM comments WHERE post_id=? ORDER BY created_at ASC";
    db.query(sql, [req.params.postId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

