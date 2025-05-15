var express=require('express');
var app=express();
var router=require('./controller/router');
var sql=require('./db/sql-connection');
app.set('view engine','ejs');
const session = require("express-session");

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
  
const authRoutes = require("./controller/auth");
app.use(authRoutes);




app.use('/',router);


app.listen(8080);