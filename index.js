const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');


require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// serve static files from /public
app.use(express.static(__dirname + '/public'));


// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req,res) => {
  res.render('home');
});

app.get('/login', (req,res) => {
  res.render('login');
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

//What Cloud Server Will Use or default port 5000 on Local Machine
const PORT = process.env.PORT || 5000;
app.listen(PORT);
