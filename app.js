const express = require('express');
const path = require('path');
const mongoose = require("mongoose");

const indexRouter = require('./routes/index');

const app = express();

// Connect MongoDB
const url = process.env.DATABASEURL || "mongodb://localhost/wotr-eventcards";
mongoose.set("useCreateIndex", true);
mongoose.connect(url, {useNewUrlParser: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// run server
app.listen(3000, () => console.log("Server listening on port 3000."));

module.exports = app;
