'use strict';

//dependencies
var config = require('./config'),
    express = require('express'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    cons = require('consolidate');

//create express app
var app = express();

//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

// configuration ===============================================================
var configLoader = require('./configLoader')(process.env.NODE_ENV || "local") //Environment
var port     = configLoader.port || 8080;
// mongoose.connect(config.dbConnectionString); // connect to our database

//setup mongoose
// app.db = mongoose.createConnection(config.mongodb.uri);
app.db = mongoose.createConnection(configLoader.dbConnectionString);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
});

//config data models
require('./models')(app, mongoose);

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade'); cannot use as default with multiple template types
app.engine('jade', cons.jade);
app.engine('ejs', cons.ejs);

//middleware
app.use(require('morgan')('dev'));
app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(session({
  secret: config.cryptoKey,
  store: new mongoStore({ url: configLoader.dbConnectionString })
}));
app.use(passport.initialize());
app.use(passport.session());
helmet.defaults(app);

//response locals
app.use(function(req, res, next) {
  res.locals.user = {};
  res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
  res.locals.user.username = req.user && req.user.username;
  next();
});

//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = app.config.companyName;
app.locals.cacheBreaker = 'br34k-01';

//setup passport
require('./passport')(app, passport);

//setup routes
require('./routes')(app, passport);

//custom (friendly) error handler
app.use(require('./views/http/index').http500);

//setup utilities
app.utility = {};
app.utility.sendmail = require('./util/sendmail');
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');

//listen up
app.server.listen(configLoader.port, function(){
  //and... we're live
  console.log("We're on port " + port)
});
