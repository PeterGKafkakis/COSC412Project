const passport = require('passport');

module.exports = (app) => {

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

//Once logged in send to surveys or wherever u wana send the user when u login
  app.get(
    '/auth/google/callback', passport.authenticate('google'),
    (req,res) => {
      res.redirect('/dashboard');
    }
  );

  app.get('/api/logout', (req,res) => {
    req.logout();
    res.redirect('/login');
  })

  app.get('/api/current_user', (req, res) => {
  res.send(req.user);
  })
};
