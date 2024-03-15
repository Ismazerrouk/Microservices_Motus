const redis = require('redis');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// Redis clients
const clientAuth = redis.createClient({
  url: process.env.REDIS_AUTH_URL, // Authentication DB URL
});

const clientScore = redis.createClient({
  url: process.env.REDIS_SCORE_URL, // Score DB URL
});

// Connect to Redis
(async () => {
  try {
    await clientAuth.connect();
    await clientScore.connect();
    console.log("Connected to Redis score and auth databases!");
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// Serve score.html from the views directory
app.get('/score', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'score.html'));
});

// Endpoint to set/update a user's score
app.post('/setscore', async (req, res) => {
  const { username, score, tries } = req.body;
});

// Endpoint to fetch user score
app.get('/getuserandscore', async (req, res) => {
  const { username } = req.query;
});

app.listen(3001, () => {
  console.log('Score service running on port 3001');
});
