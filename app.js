var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var core = require('./controller/uploadFiles');
var index = require('./routes/index');
var users = require('./routes/users');
var uploadPost = require('./routes/uploadPost');
var uploadGet = require('./routes/uploadget');
var timeTable = require('./routes/timetable');
var getTimesPost = require('./routes/timetablepost');
var chats =  require('./routes/chat');
var getClassesName = require('./routes/getClassesName');
var getTaskData = require('./routes/getTaskData');
var getClassesByName = require('./routes/getClassesByName');
var login = require('./routes/login');
var app = express();


var busboy = require('connect-busboy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(busboy());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/upload', uploadGet);
app.use('/upload', uploadPost);
app.use('/timeTable', timeTable);
app.use('/getTimes', getTimesPost);
app.use('/chat',chats);
app.use('/getClassesName', getClassesName);
app.use('/getTaskData' ,getTaskData);
app.use('/', getClassesByName);
app.use('/login', login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
