var express = require('express');
var router = express.Router();
const pool = require('../config/dbConfig');
const fs = require('fs');
const multer = require('multer');

var upload = multer({ dest: 'uploads/' });
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage });

// 회원가입 요청
router.post('/join', upload.single('userfile'), function (req, res) {
    var body = req.body
    console.log(req.body);
    var birth = req.body.year + "-" + req.body.month + "-" + req.body.day;
    var userfile = req.file.filename;
    // 데이터 삽입 sql
    var sql = "insert into user(id, passwd, img, name, school, admission, email, birth, tel, sex, type) values (? , ?, ?, ?, ?, ?, ?, ?, ? , ?, 0)"
    pool.getConnection((err, conn) => {
        conn.query(sql, [body.id, body.passwd, userfile, body.name, body.school, body.admission, body.email, birth, body.tel, body.sex,],
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
                    res.write("<script> alert('아이디가 중복되었습니다..'); history.back(); </script>");
                    return;
                }
                if (result) {
                    res.redirect("/");
                } else {
                }
            })
    })
});

//로그인
router.post('/login', function (req, res, next) {
    var sess = req.session; // 세션값 사용
    var body = req.body;
    pool.getConnection((err, conn) => {
        if (err) throw err;
        //user 안에 id랑 passwd 일치 하는지 조회
        var sql = "SELECT * FROM user WHERE id = ? AND passwd = ?";
        conn.query(sql, [body.id, body.passwd], (err, row) => {
            conn.release()
            if (err) {
                console.log("로그인 에러 발생")
                console.log(err);
            }
            else {
                if (row[0] == null) {
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
                    res.write("<script> alert('잘못입력했습니다.'); history.back(); </script>");
                }
                else {
                    //아이디 이름 타입 받아오기
                    sess.user = row[0];
                    res.redirect('http://localhost:3000');
                }
            }
        });
    })
});

// 마이페이지 개인정보 변경
router.post('/mypage/info', function (req, res) {
    console.log('마이페이지 변경');
    var sess = req.session;
    console.log(sess);
    var name = req.body.name;
    var email = req.body.email;
    var id = sess.user.id;
    console.log(req.body);
    console.log(name)
    console.log(email)
    var datas = [name, email, id]
    var sql = "UPDATE user SET name=?, email=? where user.id=?"
    if (sess.user.passwd == req.body.passwd) {
        pool.getConnection((err, conn) => {
            conn.query(sql, datas,
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (result) {
                        res.redirect("/");
                    }
                })
        })
    } else {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
        res.write("<script> alert('비밀번호가 일치하지 않습니다..'); history.back(); </script>");
    }
})

// 마이페이지 비밀번호 변경
router.post('/mypage/pw', function (req, res) {
    console.log('마이페이지 비밀번호 변경');
    var sess = req.session;
    var passwd = sess.user.passwd;
    var passwd1 = req.body.passwd1
    var passwd2 = req.body.passwd2
    var passwd3 = req.body.passwd3
    var id = sess.user.id;
    var sql = "UPDATE user SET passwd=? where user.id=?"
    if (passwd == passwd1) {
        if (passwd2 == passwd3) {
            pool.getConnection((err, conn) => {
                conn.query(sql, [passwd2, id],
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (result) {
                            res.redirect("/");
                        }
                    })
            })
        } else {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('새로운 비밀번호가 일치하지 않습니다..'); history.back(); </script>");
        }
    } else {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
        res.write("<script> alert('비밀번호가 일치하지 않습니다..'); history.back(); </script>");
    }
})

// 마이페이지 이미지 변경
router.post('/mypage/img', upload.single('userfile'),  function (req, res) {
    console.log('마이페이지 이미지 변경');
    var sess = req.session;
    var id = sess.user.id;
    var userfile = req.file.filename;
    console.log(userfile);
    var sql = "UPDATE user SET img=? where user.id=?"
    pool.getConnection((err, conn) => {
        conn.query(sql, [userfile, id],
            function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (result) {
                    res.redirect("/");
                }
            })
    })
})


module.exports = router;

