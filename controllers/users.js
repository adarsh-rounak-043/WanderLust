const User = require('./../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.email,
            username: req.body.username
        });
    
        const registeredUser = await User.register(newUser, req.body.password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to WanderLust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to WanderLust!');
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if(err) {
            return next(err);
        } else {
            req.flash('success', 'you are logged out!');
            res.redirect('/listings');
        }
    });
};
