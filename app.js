const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
require('./config/localPassport')(passport);

require('./config/fbPassportStr')(passport);

require('./config/passport')(passport);

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};
// var nodemailer = require('nodemailer');
// var sgTransport = require('nodemailer-sendgrid-transport');
// var client = nodemailer.createTransport(sgTransport(options));

//connect mongodb atlas driver
mongoose.connect(process.env.MONGODB_ATLAS);
const app = express();

// Middleware
app.use(cors(corsOption));
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'secret key', cookie: { maxAge: 1800, secure: true }, resave: true, saveUninitialized: true,
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());
app.disable('etag');
app.use(express.static(path.join(__dirname, '/public')));
require('./routes/routes')(app, passport);

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
