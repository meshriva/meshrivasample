var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// binary encryption
var bcrypt =  require('bcrypt-nodejs');

// Queue
var Q = require('q');

//express session
var session = require('express-session');

//passport for authorization
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//IBM Blue mix
var ibmbluemix = require('ibmbluemix');
var ibmcloudcode = require('ibmcloudcode');
var ibmdata = require('ibmdata');

var config = {
    applicationId: "445e9200-f6b5-4f61-8e86-d679dc9badd0",
    applicationRoute: "restmeshriva.mybluemix.net",
    applicationSecret:"726c5b4e326b90e10f529f58ab696beb55a88376"
};
ibmbluemix.initialize(config);


var port = (process.env.VCAP_APP_PORT || 3001);
//var host = (process.env.VCAP_APP_HOST || 'localhost');


var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var services = require('./routes/services');
var updateUser = require('./routes/updateUser');
var currentTrips = require('./routes/currentTrips');
var searchTrips = require('./routes/searchTrips');
var createTrip = require('./routes/createTrip');
var manageCircles = require('./routes/manageCircles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'shh its a secret', saveUninitialized: true,resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/public')));

app.use(function(req, res, next) {
    req.cloudcode = ibmcloudcode.initializeService();
    req.data = IBMData.initializeService(req);
    req.logger = logger;
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;
    next();
});

// home page of the site
app.get('/', index.home);

// sign in page
app.get('/signin',login.signin);

// sign up page
app.get('/signup',login.signup);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

app.post('/local-reg', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup'
    })
);

// starting service page
app.get('/services',services.getServiceInfo);

// update user information page
app.get('/updateUser',updateUser.getUpdateUserPage);
app.post('/updateUser',updateUser.updateDetails);

// current trips
app.get('/currentTrips',currentTrips.getCurrentTrips);

app.get('/searchTrips',searchTrips.getSearchTripPage);
app.post('/searchTrips',searchTrips.getAvailableTrips);

app.get('/subscribe/:tripId/:trustId/:creator/:user/:status',searchTrips.subscribe);
app.post('/subscribeTrip',searchTrips.postSubscribeTrip);

app.get('/createTrip',createTrip.createTripPage);
app.post('/createTrip',createTrip.createTrip);

app.get('/manageCircles',manageCircles.showServicePage);
app.get('/manageCirclesSearch',manageCircles.showSearchOptions);
app.post('/manageCirclesSearch',manageCircles.searchCircles);
app.post('/manageCirclesSubscribe',manageCircles.postSubscribeCircle);
app.get('/manageCirclesSubscribe/:user/:name/:desc/:admin/:open/:active/:location/:trustId',manageCircles.subscribeCircle);
app.get('/manageCirclesPermission',manageCircles.showCirclePendingRequest);
app.post('/manageCirclesPermission',manageCircles.submitPermissionUpdate);


//===============PASSPORT=================//

// Passport session setup.
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.email);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
    var name = req.user.email;
    console.log("LOGGING OUT " + name);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req,username, password, done) {

       // for now switching the encryption off
         //var hash = bcrypt.hashSync(password);

        // get the data from request
        var data = req.data;
        console.log(req.body.email);

        //Create a user object
        var user = data.Object.ofType("User",{
            email:req.body.email,
            name: req.body.username,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            currentLocation: req.body.currentLocation,
            vechileRegisterationNumber: req.body.vechileNumber
        });

        user.save().then(function(savedUser) {
            if (savedUser != undefined && savedUser.attributes!=undefined ) {
              // person has been saved
                console.log(savedUser);
                req.session.success = 'You are successfully registered and logged in ' + username + '!';
                console.log("data is set in session");
               done(null,savedUser.attributes);
            }else{
                console.log("COULD NOT REGISTER");
                req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
               done(null,savedUser);
            }

        }),function(err){
            //handle errors
            console.log("Got an error while saving the message"+err);
           // done(err);
        }
    }
));

/// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        var payload = {
            email:username,
            password : password
        };

        // Invoke the Post Operation
        cloudcode.post("/users/auth",payload).then(function(response) {
            console.log(response);
            var res = JSON.parse(response);
            console.log("here"+res);
            if (res != undefined ) {
                console.log("Received response"+res.response);
                done(null, res.response);
            }else{
                console.log("Can't get response for authentication request");
                done(null, res)
            }
        },function(err){
            console.log(err);
            done(err);
        });
    }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/');
}

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

console.log("Listening on:" + port);
//app.listen(port, host);
app.listen(port);