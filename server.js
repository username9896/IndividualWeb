const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const port = 3000;
const base = `${__dirname}/public`;

app.use(express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const GOOGLE_CLIENT_ID = '134720855276-7b7gooaenpdkni82v98rqv3i5l11ii78.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true,
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Active Sense",
            version: "0.1.0",
        },
        servers: [
            {
                url: "http://localhost:3000.com",
            },
        ],
    },
    apis: ["./public/*.js"],
};

const specs = swaggerjsdoc(options);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/auth/google');
}

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
}));

app.get('/protected', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/device-list.html`);
});

app.get('/', function (req, res) {
    res.sendFile(`${base}/main.html`);
});

app.get('/protected/air-conditioning', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/air-conditioning.html`);
});

app.get('/protected/feature', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/feature.html`);
});

app.get('/protected/lightdevice', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/lightdevice.html`);
});

app.get('/protected/lightning', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/lightning.html`);
});

app.get('/protected/device-list', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/device-list.html`);
});

app.get('/protected/register-device', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/register-device.html`);
});

app.get('/protected/remove-device', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/remove-device.html`);
});

app.get('/protected/removelight', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/removelight.html`);
});

app.get('/protected/removesecurity', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/removesecurity.html`);
});

app.get('/protected/security', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/security.html`);
});

app.get('/protected/securitydevice', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/securitydevice.html`);
});

app.get('/protected/send-command', isLoggedIn, (req, res) => {
    res.sendFile(`${base}/send-command.html`);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.send('Goodbye!');
    req.session.destroy();
});

app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});