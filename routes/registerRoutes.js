const mongoose = require('mongoose');

const User = require('../models/User');

module.exports = (app) => {
    app.post('/register', (req, res) => {

        let fName = req.body.fName;
        let lName = req.body.lName;
        let email = req.body.email;
        let password = req.body.password;

        req.checkBody('fName', 'First Name is required').notEmpty();
        req.checkBody('fName', 'Last Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            alert(errors);
        } else {
            let newUser = new User({
                fName: fName,
                lName: lName,
                email: email,
                password: password,
            });

            User.createUser(newUser, (err, user) => {
                if (err) throw err;
                console.log(user);
            });


            res.redirect('/login');
        }
    });
};