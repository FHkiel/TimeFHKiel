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
var ShowTask = require('./routes/ShowTask');
var SetTask = require('./routes/SetTask');
var CommentTask = require('./routes/CommentTask');
var SharedTasks = require('./routes/SharedTasks');
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
app.use('/home',isAuthenticated(),timeTable); //routes to main page
app.use('/users',isAuthenticated(), users);
app.use('/upload',isAuthenticated(), uploadGet); //the user interface to upload pdf files for conversion
app.use('/upload',isAuthenticated(), uploadPost); // RESTful post method that receives pdf file from http client
app.use('/calendar',isAuthenticated(), calendar); //test page
app.use('/timeTable', isAuthenticated(), timeTable); //html GUI for calendar
app.use('/getTimes',isAuthenticated(), getTimesPost); // test page
app.use('/chat',isAuthenticated(),chats);  // contains client side webSocket logic and GUI for chat
app.use('/getClassesName', getClassesName); // RESTful get method that provides all classes name in the DB
app.use('/getTaskData',isAuthenticated(), getTaskData);
app.use('/DoneTask',isAuthenticated(), doneTask);
app.use('/ModifyTask',isAuthenticated(), ModifyTask);
app.use('/SetTask',isAuthenticated(), SetTask);
app.use('/suggestTask',isAuthenticated(), suggestTask);
app.use('/CommentTask',isAuthenticated(), CommentTask);
app.use('/ShowTask',isAuthenticated(), ShowTask);
app.use('/SharedTasks',isAuthenticated(), SharedTasks);
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
