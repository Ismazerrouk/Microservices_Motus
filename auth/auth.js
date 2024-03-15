/**
 * @file This file contains the authentication logic for the application.
 * @module auth
 */

const express = require('express');
const session = require('express-session');
const redis = require('redis');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//const RedisStore = require('connect-redis')(session); // Importez RedisStore

let client = redis.createClient({
    url : process.env.REDIS_URL
});

(async () => {
    await client.connect();
})();

client.on('ready', () => {
    console.log("Connected to Redis !");
});

client.on("error", (err) => { 
    console.log("Error in the Connection"); 
}); 
//////////////////////////////////////////////////////

//Generate a secret key randomly in 32 bytes
const secretKey = crypto.randomBytes(32).toString('hex');

// Session middleware: enables session storage for users
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.status(401).send('You must be logged in to access this resource');
    }
}

module.exports = isAuthenticated;

//////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.sendFile('views/auth.html', { root: __dirname });
});


// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Check if the username and password match the ones in the Redis database
    try {
        const reply = await client.get(`user:${username}`);
        if (reply === password) {
            req.session.user = username;
            return res.redirect('http://localhost:3000') // Redirect to the game
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

app.get('/register', (req, res) => {
    res.sendFile('views/register.html', { root: __dirname });
});

// Route to display the registration form
app.post('/createUser', (req, res) => {
    const { username, password } = req.body;

    // Store the username and password in the Redis database
    if (typeof username === 'string' && typeof password === 'string') {
        client.set(`user:${username}`, password, redis.print);
        res.sendFile('views/auth.html', { root: __dirname });
    } else {
        res.status(400).send('Invalid username or password');
    }
});

//////////////////////////////////////////////////////

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});