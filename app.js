var express = require('express');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var subCategoryRouter=require('./routes/subCategory');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/v1/auth', usersRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/subCategory', subCategoryRouter);

mongoose.connect('mongodb://localhost:27017/Dashboard')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });


app.listen(5000, () => console.log('server is running on 5000'))

module.exports = app;
