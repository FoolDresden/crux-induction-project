var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var bcrypt = require('bcrypt');

var {mongoose} = require('./db/mongoose.js');
var {Blog} = require('./models/blogs.js');
var {User} =require('./models/user.js');

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/views/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'lala'}))

app.get('/blogs', (req, res)=>{
  if(!req.session.User)
  {
    req.session.User = {
      name: 'guest',
      pwd: 'password',
    }
  }
  Blog.find().then((doc)=>{
    console.log(doc[0]._id);
    if(doc){
      res.render(path.join(__dirname, '/views/home.hbs'), {
        user: req.session.User.name,
        blogs: doc,
      })
    }
  });
});

app.get('/blogs/:id', (req, res)=>{
  var id = req.params.id;
  Blog.findById(id).then((doc)=>{
    if(doc){
      res.render(path.join(__dirname, '/views/blog.hbs'), {
        id: doc._id,
        name: doc.name,
        body: doc.body,
        author: doc.author,
        comments: doc.comments,
        user: req.session.User.name,
      })
    }
  });
});

app.get('/create', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/create.html'));
});

app.post('/create', (req, res)=>{
  console.log(req.body);
  var doc = {
    name: req.body.name,
    body: req.body.body,
    author: req.session.User.name,
  };
  Blog.create(doc, function(err, doc){
    if(err){

    }else{
      User.findOne({name: req.session.User.name}).then((user)=>{
        user.blogs.push(doc);
        user.save();
        res.redirect('/blogs')
      })
    }
  });
});

app.get('/register', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.post('/register', (req, res)=>{
  // console.log(req.body);
  var name = req.body.name;
  var salt = bcrypt.genSaltSync(2);
  var hash = bcrypt.hashSync(req.body.pwd, salt);
  var user = {
    name: name,
    pwd: hash,
  }
  console.log(user);
  User.create(user, function(err, doc){
    if(err){

    }else {
      req.session.User = doc;
      res.redirect('/blogs');
    }
  });
});

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.post('/login', (req, res)=>{
  var name = req.body.name;
  User.findOne({name}).then((doc)=>{
    if(doc)
    {
      if(bcrypt.compareSync(req.body.pwd, doc.pwd))
      {
        req.session.User = doc;
        res.redirect('/blogs');
      }
      else {
        res.render(path.join(__dirname, '/views/error.hbs'));
      }
    }
  });
})

app.post('/blogs/comments/:id', (req, res)=>{
  // console.log("hi");
  // console.log(req.body);
  // console.log(req.params.id);
  Blog.findOne({name: req.params.id}).then((doc)=>{
    var data = {
      text: req.body.comment,
      author: req.session.User.name,
    }
    console.log(data);
    doc.comments.push(data);
    doc.save();
  });
});

app.listen(3000, function(){
  console.log('Hi');
});
