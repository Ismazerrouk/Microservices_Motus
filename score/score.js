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

  try {
    // Check if the user exists in the auth database
    const userId = await clientAuth.get(`username:${username}`);
    if (!userId) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Prepare and set the score data in the score database
    const scoreData = JSON.stringify({ score, tries });
    await clientScore.hSet('players', userId, scoreData);

    res.send({ message: 'Score updated successfully.' });
  } catch (error) {
    console.error('Failed to set score:', error);
    res.status(500).send({ error: 'Error setting score' });
  }
});


// Endpoint to fetch user score
app.get('/getuserandscore', async (req, res) => {
  const { username } = req.query;

  try {
    // Check if the user exists in the auth database
    const userId = await clientAuth.get(`username:${username}`);
    if (!userId) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Fetch the user's score data from the score database
    const scoreData = await clientScore.hGet('players', userId);
    if (!scoreData) {
      return res.status(404).send({ error: 'Score not found' });
    }

    const parsedData = JSON.parse(scoreData);
    res.json({ username, score: parsedData.score, tries: parsedData.tries });
  } catch (error) {
    console.error('Failed to fetch score:', error);
    res.status(500).send({ error: 'Error fetching score' });
  }
});

app.listen(3001, () => {
  console.log('Score service running on port 3001');
});
