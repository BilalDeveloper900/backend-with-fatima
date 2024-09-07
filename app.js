var express = require('express');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('./helpers/googleAuth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var subCategoryRouter=require('./routes/subCategory');
var productRouter=require('./routes/products');
const session = require('express-session');
const passport = require('passport');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'mySecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api/v1/auth', usersRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/subCategory', subCategoryRouter);
app.use('/api/v1/product',productRouter);

mongoose.connect('mongodb://localhost:27017/Dashboard')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });


app.listen(5000, () => console.log('server is running on 5000'))

module.exports = app;
