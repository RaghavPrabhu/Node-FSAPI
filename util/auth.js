var restify = require('restify'),
    userId = 'admin',
    pwd = 'password',
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy;
 
passport.use(new BasicStrategy(
    function (username, password, done) {
        findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
    
));
 
// Just use a single user that can access this service set from deployment var
var users = [
    { id: 1, username: userId, password: pwd}
];
 
function findByUsername(username, fn) {
    
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}
 
exports.authenticate = function (req, res, next, callback) {
    passport.authenticate('basic', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var error = new restify.InvalidCredentialsError('Failed to authenticate.');
            res.send(error);
            return next();
        }
 
        callback(req, res, next);
    })(req, res, next);
};