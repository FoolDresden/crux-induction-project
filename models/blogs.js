var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
  name:{
    // required: true,
    minlength: 3,
    trim: true,
    type: String,
    unique: true,
  },
  body:{
    required: true,
    trim: true,
    type: String,
  },
  author:{
    required: true,
    trim: true,
    type: String,
  },
  comments:{
    type: [{
      text:{
        type: String,
      },
      author:{
        type:String,
      }
    }],
    default: [],
  },
});

var Blog = mongoose.model('Blog', blogSchema);

module.exports = {
  Blog,
}
