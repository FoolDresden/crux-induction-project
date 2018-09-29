var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name:{
    trim: true,
    type: String,
    unique: true,
    default: 'guest',
  },
  pwd: {
    required: true,
    type: String,
    minlength: 8,
  },
  blogs: {
    type: [{type: String}],
    default: [],
  },
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User,
}
