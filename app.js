var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
})
var upload = multer({storage: _storage})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var app = express();

app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/user', express.static('uploads'));

// 사용자가 post방식으로 전송한 데이터가 upload 가리키면 동작
// 두번째 인자로 멀터 모듈을 미들웨어가 함수실행전에 사용자 전송데이터 파일 포함시 파일 가공하여 리퀘스트 객체 파일 프로퍼티 암시적 추가

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/')));


app.use(session({
  secret: 'fdasj#@U!&#%#$',
  resave: false,
  saveUninitialized: true,   // 세션이 필요하기전까진 세션을 실행하지 않겠다
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
