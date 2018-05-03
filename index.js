const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');


require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req,res) => {
  res.render('home');
});

app.get('/login', (req,res) => {
  res.render('login');
});
app.get('/feedback', (req, res) => {
   res.render('feedback');
});
app.get('/dashboard', (req,res) => {
  res.render('dashboard');
});

app.get('/contact', (req,res) => {
  res.render('contact');
});

app.get('/feedback', (req,res) => {
  res.render('feedback');
});

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/registerRoutes')(app);
//test comment for github

//What Cloud Server Will Use or default port 5000 on Local Machine
const PORT = process.env.PORT || 5000;
app.listen(PORT);
