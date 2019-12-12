const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors=require('cors')
var helmet =require('helmet');
var csurf = require('csurf');
let secureEnv = require('secure-env');
const logger = require("morgan");
const expressValidator = require("express-validator");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
  global.env = secureEnv({secret:process.env.SECRET});  
  console.log(global.env.COOKIE_SECRET)
}
const passport = require("./config/passport");
const indexRouter = require("./routes/index");
const testsRouter = require("./routes/tests");
const { router: gameRouter } = require("./routes/game");
const registrationRouter = require("./routes/registration");
const lobbyRouter = require("./routes/lobby");
const leaveGameRouter = require("./routes/leaveGame");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
console.log(process.env.TEST)
app.disable('x-powered-by');
app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json({ limit:'8mb'}));
app.use(bodyParser.urlencoded({ limit:'8mb', extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());
// passport and sessions related stuff
app.use(
  session({resave: false, name: '_csrf',
  secret: global.env.COOKIE_SECRET,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge:6000000,
    httpOnly: true,
    
  }
  }));
app.use(bodyParser.urlencoded({ extended: false }))


app.use(passport.initialize());
app.use(passport.session());
app.use(csurf())
app.use("/", indexRouter);
app.use("/game", gameRouter);
app.use("/lobby", lobbyRouter);
app.use("/registration", registrationRouter);
app.use("/tests", testsRouter);
app.use("/leave", leaveGameRouter);
app.use("/*", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
