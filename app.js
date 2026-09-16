var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var adminsRouter = require('./routes/admin.routes');
var commandesRouter = require('./routes/commandes.routes');
var lignesCommandeRouter = require('./routes/lignesCommande.routes');
var paiementsRouter = require('./routes/paiements.routes');
var produitsRouter = require('./routes/produits.routes');

const http = require('http');

const { connectDB }= require('./config/mongo.connexion');

var app = express();

// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admins', adminsRouter);
app.use('/commandes', commandesRouter);
app.use('/lignes-commandes', lignesCommandeRouter);
app.use('/paiements', paiementsRouter);
app.use('/produits', produitsRouter);

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

const server = http.createServer(app);
server.listen(process.env.port,()=>{
  connectDB();
  console.log(`Server is running on port ${process.env.port}`);
});


