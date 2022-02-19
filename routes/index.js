var express = require('express');
var router = express.Router();
const pool = require('../config/dbConfig');

// 메인페이지
router.get('/', function (req, res, next) {
  var sess = req.session;
  if (sess.user != undefined) {
    console.log(sess.user.school);
    var school_sql = "SELECT * FROM school where school.name=? "
    pool.getConnection((err, conn) => {
      conn.query(school_sql, [sess.user.school], function (err, rows) {
        if (err) {
          console.log('에러');
          console.log(err);
        }
        conn.release();
        console.log(rows);
        console.log("개인 홈페이지")
        res.render('main/main.ejs', { sess: sess, rows:rows });
      })
    })
  } else {
        console.log("개인 홈페이지")
        res.render('main/main.ejs', { sess: sess });
  }
});

//게시판 메인페이지 이동
router.get('/main', function (req, res, next) {
  var sess = req.session;
  // 아이돌 게시물 최신 날짜로 정렬해서 받아오기
  var sql = "SELECT * FROM content where content.sort = '아이돌 / 연예인' ORDER BY content.number DESC "
  // 패션 게시물 최신 날짜로 정렬해서 받아오기
  var sql2 = "SELECT * FROM content where content.sort = '패션게시판' ORDER BY content.number DESC "
  // 공지 가져오기
  var sql3 = "SELECT * FROM content where content.sort = '공지사항' ORDER BY content.number DESC "
  // 펫 게시글 최신 날짜로 정렬해서 받아오기
  var sql5 = "SELECT * FROM content where content.sort = 'PET 게시판' ORDER BY content.number DESC "
  //학교 정보
  var sql4 = "SELECT * FROM school where school.name=? "
  // 조회수 높은 게시글
  var sql_hit = "SELECT * FROM content ORDER BY content.hit DESC"
  // 자유게시판
  var sql_free = "SELECT * FROM content where content.sort = '자유게시판' ORDER BY content.number DESC "
  // LOL게시판
  var sql_lol = "SELECT * FROM content where content.sort = 'LOL게시판' ORDER BY content.number DESC "
  // 동아리 게시판
  var sql_club = "SELECT * FROM content where content.sort = '동아리학회' ORDER BY content.number DESC "
  // 메이플 게시판
  var sql_maple = "SELECT * FROM content where content.sort = 'Dㅔ이플SU토리' ORDER BY content.number DESC "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, idol) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      conn.query(sql2, function (err, fashion) {
        if (err) {
          console.log('에러');
          console.log(err);
        }
        conn.query(sql3, function (err, public) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.query(sql5, function (err, pet) {
            if (err) {
              console.log('에러');
              console.log(err);
            }
            conn.query(sql_hit, function (err, hit_content) {
              if (err) {
                console.log('에러');
                console.log(err);
              }
              conn.query(sql_free, function (err, free_content) {
                if (err) {
                  console.log('에러');
                  console.log(err);
                }
                conn.query(sql_lol, function (err, lol_content) {
                  if (err) {
                    console.log('에러');
                    console.log(err);
                  }
                  conn.query(sql_club, function (err, club_content) {
                    if (err) {
                      console.log('에러');
                      console.log(err);
                    }
                    conn.query(sql_maple, function (err, maple_content) {
                      if (err) {
                        console.log('에러');
                        console.log(err);
                      }
                      if (sess.user == undefined) {
                        conn.release();
                        console.log('메인 게시판');
                        res.render('index.ejs', { title: '메인게시판', page: 'board/board_main.ejs', 
                        sess: sess, idol: idol, fashion: fashion, public: public ,pet:pet, hit_content:hit_content, free_content:free_content, lol_content:lol_content, club_content:club_content, maple_content:maple_content})
                      } else {
                        conn.query(sql4, [sess.user.school], function (err, school) {
                          if (err) {
                            console.log('에러');
                            console.log(err);
                          }
                          conn.release();
                          console.log('메인 게시판');
                          res.render('index.ejs', { title: '메인게시판', page: 'board/board_main.ejs', 
                          sess: sess, idol: idol, fashion: fashion, public: public, school: school ,pet:pet, hit_content:hit_content, free_content:free_content, lol_content:lol_content, club_content:club_content, maple_content:maple_content})
                        })
                      }
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

//회원가입 페이지 이동
router.get('/join', function (req, res, next) {
  var sess = req.session;
  sess.destroy();
  console.log("회원가입");
  res.render('index', { title: '회원가입', page: 'user/join.ejs', sess: sess });
});


// 로그인 페이지 이동
router.get('/login', function (req, res) {
  var sess = req.session;
  console.log("로그인");
  res.render('index', { title: '로그인', page: 'user/login.ejs', sess: sess });
});

// 로그아웃 요청
router.get('/logout', function (req, res) {
  var sess = req.session;
  console.log("로그아웃");
  console.log(sess);
  sess.destroy();
  res.redirect('/');
});

// 게시글 작성 페이지 이동
router.get('/board_edit', function (req, res) {
  var sess = req.session;
  console.log("게시글 작성");
  var sql = "SELECT * FROM sort"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, rows) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        console.log('메인 게시판');
        res.render('index', { title: '기사 작성', page: 'board/board_edit.ejs', sess: sess, rows: rows });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: '기사 작성', page: 'board/board_edit.ejs', sess: sess, rows: rows, school: school });
        })
      }
    })
  })
});

// 전체 게시글 조회 (최신 글 조회)
router.get('/up_to_date', function (req, res) {
  var sess = req.session;
  console.log("최신 글조회");
  var sql = "SELECT * FROM content where content.sort != '공지사항' ORDER BY content.number DESC "
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, row) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        res.render('index', { title: '최신 글조회', page: 'board/up_to_date.ejs', sess: sess, row: row });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: '최신 글조회', page: 'board/up_to_date.ejs', sess: sess, row: row, school: school });
        })
      }
    })
  })
});

// 게시글 조회
router.get('/content/:number', function (req, res, next) {
  var number = req.params.number;
  var body = req.body;
  var sess = req.session;
  var sql = "SELECT * FROM content where number=?";
  var sql2 = "SELECT * FROM user where id=?"
  var hit_sql = "UPDATE content SET hit=? where content.number=?"
  console.log("컨텐츠 보기");
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "
  var reply_sql = "SELECT * FROM reply where reply.content_number=? "
  pool.getConnection((err, conn) => {
    conn.query(sql, [number], function (err, row) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      console.log(conn.query)
      conn.query(hit_sql, [row[0].hit+1 , row[0].number], function(err, rows){
        if (err) {
          console.log(err);
        }
        conn.query(sql2, [row[0].user_id], function (err, row2) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.query(reply_sql, [number], function (err, reply) {
            if (err) {
              console.log('에러');
              console.log(err);
            }
            if (sess.user == undefined) {
              if (err) {
                console.log('에러');
                console.log(err);
              }
              conn.release();
              console.log(row)
              res.render('index', { title: "게시글", page: 'board/content.ejs', row: row, row2: row2, sess: sess, reply:reply });
            } else {
              conn.query(school_sql, [sess.user.school], function (err, school) {
                if (err) {
                  console.log('에러');
                  console.log(err);
                }
                console.log(reply)
                conn.release();
                res.render('index', { title: "게시글", page: 'board/content.ejs', row: row, row2: row2, sess: sess, school: school, reply:reply });
              })
            }
          })
        })
      })
    })
  });
})
//검색한 게시글 조회
router.get('/search_content/:search_content', function (req, res, next) {
  var url = req.params.search_content;
  var sess = req.session;
  console.log(url + " 검색");
  var sql = "SELECT * FROM content WHERE content.title LIKE concat('%', ?, '%')"
  //학교 정보
  var school_sql = "SELECT * FROM school where school.name=? "

  pool.getConnection((err, conn) => {
    conn.query(sql, [url], function (err, row) {
      if (err) {
        console.log('에러');
        console.log(err);
      }
      if (sess.user == undefined) {
        conn.release();
        res.render('index', { title: "게시글", page: 'board/search_content.ejs', row: row, sess: sess });
      } else {
        conn.query(school_sql, [sess.user.school], function (err, school) {
          if (err) {
            console.log('에러');
            console.log(err);
          }
          conn.release();
          res.render('index', { title: "게시글", page: 'board/search_content.ejs', row: row, sess: sess, school: school });
        })
      }
    })
  })
})

//검색한 게시글 조회
module.exports = router;
