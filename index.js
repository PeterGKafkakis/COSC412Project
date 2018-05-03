const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');


require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/feedback', (req, res) => {
  res.render('feedback');
});
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});


// Count Number of Tickets Users Have Created

var count = 0;
app.post('/contact', (request, response) => {
  var postBody = request.body.areaInput;
  console.log(postBody);
  count++;
  var message = ""
  var htmlArray = [];



  for(var i =0; i < 3; i++)
  {
    if(i == 0)
    {
      message = "<h1>" + "Please Remember Your Ticket Number " + count + " <h1>"
      htmlArray.push(message)
    }
    if(i==1){
      message = "<h2>" + "Please Give us" + " 1 TO 2 Business Days to contact you back with help! Also checkout our Facebook Page as well and Message us on there" + "</h2>"
      htmlArray.push(message)
    }

    if(i==2){
       message = "<p> " + "User Message: "+ postBody + " </p>"
       htmlArray.push(message)
    }
  }

  htmlArray = htmlArray.toString();

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: 'stefanoskafkakis123@gmail.com',
      pass: 'Towson123$'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let HelperOptions = {

    from: '"Peter Kafkakis" <petergkafkakis@gmail.com',
    to: 'petergkafkakis@gmail.com',
    subject: 'Contact Ticket Request',
    html: htmlArray
  };

  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("The message was sent!");
    console.log(info);
  });
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
require('./routes/userRoutes')(app);
//test comment for github

//What Cloud Server Will Use or default port 5000 on Local Machine
const PORT = process.env.PORT || 5000;
app.listen(PORT);
