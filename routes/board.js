var express = require('express');
var router = express.Router();
const pool = require('../config/dbConfig');
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

// 게시글
router.post('/board_edit', upload.single('userfile'), function (req, res) {
  var body = req.body;
  var sess = req.session;
  if (req.file == undefined) {
    console.log("hi");
    var sql = "insert into content(user_id, user_name, sort, title, img, content, edit_date, update_date, hit) values (?,?,?,?,?,?,now(),now(),0)"
    pool.getConnection((err, conn) => {
      conn.query(sql, [sess.user.id, sess.user.name, body.sort, body.title, userfile, body.content],
        function (err, result) {
          if (err) {
            console.log(err);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('게시글 작성에 문제가 있습니다..'); history.back(); </script>");
            return;
          }
          if (result) {
            conn.release()
            res.redirect("http://localhost:3000/main");
          } else {
          }
        });
    })
  } else {
    var userfile = req.file.filename;
    var sql = "insert into content(user_id, user_name, sort, title, img, content, edit_date, update_date, hit) values (?,?,?,?,?,?,now(),now(),0)"
    console.log(sql);
    pool.getConnection((err, conn) => {
      conn.query(sql, [sess.user.id, sess.user.name, body.sort, body.title, userfile, body.content],
        function (err, result) {
          if (err) {
            console.log(err);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('게시글 작성에 문제가 있습니다..'); history.back(); </script>");
            return;
          }
          if (result) {
            conn.release()
            res.redirect("http://localhost:3000/main");
          } else {
          }
        });
    })
  }
})

// 게시글 리스트 조회
router.get('/list/:url', function (req, res) {
  var url = req.params.url;
  var sess = req.session;
  console.log("게시판 리스트");
  var sql = "SELECT * FROM sort where sort.url=?"
  var sql2 = "SELECT * FROM content where content.sort=? ORDER BY content.number DESC"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, [url], function (err, row) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      conn.query(sql2, [row[0].name], function (err, row2) {
        if (err) {
          console.log('에러');
          console.log(err);
        }
        if (sess.user == undefined) {
          conn.release();
          res.render('index', { title: "게시글", page: 'board/board.ejs', row: row, row2: row2, sess: sess });
        } else {
          conn.query(school_sql, [sess.user.school], function (err, school) {
            if (err) {
              console.log('에러');
              console.log(err);
            }
            conn.release();
            res.render('index', { title: "게시글", page: 'board/board.ejs', row: row, row2: row2, sess: sess, school: school });
          })
        }
      })
    })
  })
});

//장터 게시판 조회 [전체]
router.get('/market_type=all', function (req, res) {
  var sess = req.session;
  console.log("장터 게시판 조회");
  var sql = "SELECT * FROM market"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        res.render('index', { title: "장터 게시판 조회", page: 'board/market.ejs', rows: rows, sess: sess });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: "장터 게시판 조회", page: 'board/market.ejs', rows: rows, sess: sess, school: school });
        })
      }
    })
  })
});
//장터 게시판 조회
router.get('/market_type/:type', function (req, res) {
  var sess = req.session;
  var type = req.params.type;
  console.log("장터 게시판 조회");
  var sql = "SELECT * FROM market where market.type=?"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, [type], function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        console.log(type)
        res.render('index', { title: "장터 게시판 조회", page: 'board/market_type.ejs', rows: rows, sess: sess, type:type });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: "장터 게시판 조회", page: 'board/market_type.ejs', rows: rows, sess: sess, school: school, type:type });
        })
      }
    })
  })
});


// 작성한 게시글 조회
router.get('/edit_content/:id', function (req, res) {
  var sess = req.session;
  var id = req.params.id;
  console.log("작성한 게시글 조회");
  var sql = "SELECT * FROM content where content.user_id=?"
  var sql2 = "SELECT * FROM content where content.user_id=? ORDER BY content.number DESC"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, [id], function (err, row) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      conn.query(sql2, [id], function (err, row2) {
        if (err) {
          console.log('에러');
          console.log(err);
        }
        if (sess.user == undefined) {
          conn.release();
          res.render('index', { title: "게시글", page: 'board/edit_content.ejs', row: row, row2: row2, sess: sess });
        } else {
          conn.query(school_sql, [sess.user.school], function (err, school) {
            if (err) {
              console.log('에러');
              console.log(err);
            }
            conn.release();
            res.render('index', { title: "게시글", page: 'board/edit_content.ejs', row: row, row2: row2, sess: sess, school: school });
          })
        }
      })
    })
  })
});

// 장터 게시글 작성
router.get('/upload_market', function (req, res) {
  var sess = req.session;
  console.log("장터 게시글 작성");
  var sql = "SELECT * FROM market_sort"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        res.render('index', { title: '장터 게시글 작성', page: 'board/upload_market.ejs', sess: sess, rows: rows });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: '장터 게시글 작성', page: 'board/upload_market.ejs', sess: sess, rows: rows, school: school });
        })
      }
    })
  })
});

// 장터게시글 조회
router.get('/market_posting_inquiry/:number', function (req, res, next) {
  var number = req.params.number;
  var sess = req.session;
  var sql = "SELECT * FROM market where market.number=?";
  var sql2 = "SELECT * FROM user where id=?"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) =>{
    conn.query(sql, [number],function (err, row) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      conn.query(sql2, [row[0].id] ,function (err, row2) {
        if (err) {
          console.log('에러');
          console.log(err);
        }
        console.log(row)
        console.log(row2)
        if(sess.user == undefined){
          conn.release();
          res.render('index', { title: "게시글", page: 'board/market_posting_inquiry.ejs', row: row, row2:row2, sess:sess});
        } else{
          conn.query(school_sql ,[sess.user.school], function (err, school) {
            if (err) {
              console.log('에러');
              console.log(err);
            }
            conn.release();
            res.render('index', { title: "게시글", page: 'board/market_posting_inquiry.ejs', row: row, row2:row2, sess:sess, school:school});
          })
        }
      })
    })
  });
})

// 장터 게시글 작성(post)
router.post('/upload_market', upload.single('userfile'), function (req, res) {
  var body = req.body;
  var sess = req.session;
  if (req.file == undefined) {
    var sql = "insert into market(id, type, sort, name, price, product, img, content, date) values (?,?,?,?,?,?,?,?,now())"
    pool.getConnection((err, conn) => {
      conn.query(sql, [sess.user.id, body.type, body.sort, sess.user.name, body.price, body.product, userfile, body.content],
        function (err, result) {
          if (err) {
            console.log(err);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('게시글 작성에 문제가 있습니다..'); history.back(); </script>");
            return;
          }
          if (result) {
            res.redirect("/");
          } else {
          }
        });
    })

  } else {
    var userfile = req.file.filename;
    var sql = "insert into market(id, type, sort, name, price, product, img, content, date) values (?,?,?,?,?,?,?,?,now())"
    console.log(sql);
    pool.getConnection((err, conn) => {
      conn.query(sql, [sess.user.id, body.type, body.sort, sess.user.name, body.price, body.product, userfile, body.content],
        function (err, result) {
          if (err) {
            console.log(err);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('게시글 작성에 문제가 있습니다..'); history.back(); </script>");
            return;
          }
          if (result) {
            res.redirect("/");
          } else {
          }
        });
    })
  }
})

//마이페이지
router.get('/mypage/:sort', function (req, res) {
  var sess = req.session;
  var url = req.params.sort;
  console.log("마이페이지");
  var sql = "SELECT * FROM market_sort"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        console.log(url);
        conn.release();
        res.render('my_page', { title: '마이페이지', page: 'board/mypage_main.ejs', sess: sess, rows: rows, url: url });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          if (url == 'my') {
            console.log(url);
            conn.release();
            res.render('my_page', { title: '마이페이지-메인', page: 'board/mypage_main.ejs', sess: sess, rows: rows, url: url, school: school });
          }
          if (url == 'info') {
            console.log(url);
            conn.release();
            res.render('my_page', { title: '마이페이지-정보변경', page: 'board/change_info.ejs', sess: sess, rows: rows, url: url, school: school });
          }
          if (url == 'pw') {
            console.log(url);
            conn.release();
            res.render('my_page', { title: '마이페이지-정보변경', page: 'board/change_pw.ejs', sess: sess, rows: rows, url: url, school: school });
          }
          if (url == 'img') {
            console.log(url);
            conn.release();
            res.render('my_page', { title: '마이페이지-정보변경', page: 'board/change_img.ejs', sess: sess, rows: rows, url: url, school: school });
          }
        })
      }
    })
  })
});

// 강의평가
router.get('/lecture_evaluation_list', function (req, res) {
  var sess = req.session;
  console.log("강의평가 리스트");
  var sql = "SELECT * FROM lecture_evaluation where lecture_evaluation.school=?"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql,[sess.user.school], function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        console.log(rows)
        res.render('index', { title: '강의평가 리스트', page: 'board/lecture_evaluation_list.ejs', sess: sess, rows: rows });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          console.log(rows)
          res.render('index', { title: '강의평가 리스트', page: 'board/lecture_evaluation_list.ejs', sess: sess, rows: rows, school: school });
        })
      }
    })
  })
});

// 강의평가
router.get('/lecture_evaluation_upload', function (req, res) {
  var sess = req.session;
  console.log(sess.user.school)
  console.log("강의평가 작성");
  var sql = "SELECT * FROM market_sort"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        res.render('index', { title: '강의평가 작성', page: 'board/lecture_evaluation_upload.ejs', sess: sess, rows: rows });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: '강의평가 작성', page: 'board/lecture_evaluation_upload.ejs', sess: sess, rows: rows, school: school });
        })
      }
    })
  })
});

//강의평가 업로드
router.post('/lecture_evaluation_upload',upload.single('userfile'),  function (req, res) {
  var body = req.body;
  var sess = req.session;
  console.log(body);
  var sql = "insert into lecture_evaluation(id, name, school, lecture, score, professor, opinion) values (?,?,?,?,?,?,?)"
    pool.getConnection((err, conn) => {
      conn.query(sql, [sess.user.id, sess.user.name, sess.user.school, body.lecture, body.score, body.professor, body.opinion],
        function (err, result) {
          if (err) {
            console.log(err);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('강의 평가 작성에 문제가 있습니다..'); history.back(); </script>");
            return;
          }
          if (result) {
            res.redirect("http://localhost:3000/board/lecture_evaluation_list");
          } else {
          }
        });
    })
})
//댓글 작성
router.post('/content/:number',  function (req, res) {
  var number = req.params.number;
  var body = req.body;
  var sess = req.session;
  console.log(sess);
  console.log("넘어온다");
  var sql = "insert into reply (content_number, id, content, date) values (?,?,?,now())"
    pool.getConnection((err, conn) => {
      conn.query(sql, [number, sess.user.id, body.reply],
        function (err, result) {
          if (err) {
            console.log(err);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('댓글 작성에 문제가 있습니다..'); history.back(); </script>");
            return;
          }
          if (result) {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write("<script> alert('댓글 작성 완료..'); history.back(); </script>");
          } else {
          }
        });
    })
})

// 게시글 수정 페이지 GET
router.get('/content_update/:number', function (req, res) {
  var number = req.params.number;
  var sess = req.session;
  console.log(sess.user.school)
  console.log("게시글 수정");
  var sql = "SELECT * FROM content where content.number=?"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, [number], function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        res.render('index', { title: '게시글 수정', page: 'board/content_update.ejs', sess: sess, rows: rows });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: '게시글 수정', page: 'board/content_update.ejs', sess: sess, rows: rows, school: school });
        })
      }
    })
  })
});

//게시글 수정 페이지 POST
router.post('/content_update/:number', upload.single('userfile'),  function (req, res) {
  console.log('마이페이지 이미지 변경');
  var number = req.params.number;
  var userfile = req.file.filename;
  var title = req.body.title
  var content = req.body.content
  console.log(userfile);
  console.log("넘어온다")
  console.log(number);
  var datas = [title, userfile, content]
  console.log(datas);
  var sql = "UPDATE content SET title=?, img=?, content=? where content.number=?"
  pool.getConnection((err, conn) => {
      conn.query(sql, [req.body.title ,userfile, req.body.content, number],
          function (err, result) {
              if (err) {
                  console.log(err);
                  return;
              }
              if (result) {
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
                res.write("<script> alert('게시글 수정 완료..'); history.go(-2); </script>");
              }
          })
  })
})
module.exports = router;