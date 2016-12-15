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
var doneTask = require('./routes/DoneTask');
var ModifyTask = require('./routes/ModifyTask');
var app = express();
var isAuthenticated=require('./middleware/authentication');
var suggestTask = require('./routes/SuggestTask');
var calendar = require('./routes/calendar')

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

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates//abhishek//
var flash = require('connect-flash');
app.use(flash());

// Configuring Passport abhishek//
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'sec7ret',resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());


// Initialize Passport abhishek//
var initPassport = require('./passport/init');
initPassport(passport);

// isAuthenticated added by abhishek to protect routes//
app.use('/', login(passport));
app.use('/login', login(passport));
app.use('/home',isAuthenticated(),index);
app.use('/users',isAuthenticated(), users);
app.use('/upload',isAuthenticated(), uploadGet);
app.use('/upload',isAuthenticated(), uploadPost);
app.use('/calendar',isAuthenticated(), calendar);
app.use('/timeTable',isAuthenticated(), timeTable);
app.use('/getTimes',isAuthenticated(), getTimesPost);
app.use('/chat',isAuthenticated(),chats);
app.use('/getClassesName', getClassesName);
app.use('/getTaskData',isAuthenticated() ,getTaskData);
app.use('/DoneTask',isAuthenticated() ,doneTask);
app.use('/ModifyTask',isAuthenticated() ,ModifyTask);
app.use('/suggestTask',isAuthenticated() ,suggestTask);
app.use('/', getClassesByName);



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
