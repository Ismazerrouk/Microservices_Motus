const express = require('express');
const session = require('express-session');
const redis = require('redis');
const bodyParser = require('body-parser');



//const RedisStore = require('connect-redis')(session); // Importez RedisStore

let client = redis.createClient();

(async () => {
    await client.connect();
})();

client.on('ready', () => {
    console.log("Connected to Redis !");
});

client.on("error", (err) => { 
    console.log("Error in the Connection"); 
}); 


// Middleware to check if the user is authenticated
// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.user) {
//         return next();
//     } else {
//         res.status(401).send('You must be logged in to access this resource');
//     }
// }

// module.exports = isAuthenticated;

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile('views/auth.html', { root: __dirname });
});


// Simulated user database (for demonstration purposes)
// const users = [
//     { username: 'user1', password: 'password1' },
//     { username: 'user2', password: 'password2' }
// ];


// Define your API routes

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if the username and password match the ones in the Redis database
    client.get(`user:${username}`, (_, reply) => {
        if (reply === password) {
            req.session.user = username;
            return res.redirect('http://localhost:3000') // Redirect to the game
        } else {
            return res.status(401).send('Invalid username or password');
        }
    });
});

// app.post('/', (req, res) => {
//     const { username, password } = req.body;

//     // Check if the username and password match
//     const user = users.find(user => user.username === username && user.password === password);

//     if (user) {
//         // If correct, save the login in the session
//         req.session.username = username;
//         res.redirect('/motus/index.html', { root: __dirname });
//     } else {
//         // If not correct, display an error message
//         res.send('Invalid username or password. Please try again.');
//     }
// });


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



// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});