const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String
});

const UserSchema = new Schema({
  fName: {
    type: String
  },
  lName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
}

module.exports.getByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}

module.exports.comparPassword = function(candidatePassword, has, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}

mongoose.model('users', userSchema);
