
const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.static('static'));

// Configure express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Simulated user database (for demonstration purposes)
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Define your API routes

// Route to display the registration form
app.get('/register', (req, res) => {
    res.send('Please register:<br><form method="post" action="/register">Username: <input type="text" name="username"><br>Password: <input type="password" name="password"><br><input type="submit" value="Register"></form>');
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        // If the username already exists, display an error message
        res.send('Username already exists. Please choose a different username.');
    } else {
        // If the username does not exist, add the new user to the database
        users.push({ username, password });
        res.send('Registration successful. You can now login.');
    }
});

// Route to handle login page
app.get('/login', (req, res) => {
    res.send('Please enter your login and password:<br><form method="post" action="/login">Username: <input type="text" name="username"><br>Password: <input type="password" name="password"><br><input type="submit" value="Login"></form>');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password match
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // If correct, save the login in the session
        req.session.username = username;
        res.redirect('/game');
    } else {
        // If not correct, display an error message
        res.send('Invalid username or password. Please try again.');
    }
});

// API endpoint to display game main page
app.get('/game', (req, res) => {
    // Check if the user is logged in
    if (!req.session.username) {
        // If not logged in, redirect to the login page
        return res.redirect('/login');
    }

    // If logged in, display the game main page
    res.redirect('http://localhost:3000');
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/register`);
});