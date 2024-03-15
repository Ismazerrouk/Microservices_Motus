const redis = require('redis');
const express = require('express');
const app = express();
app.use(express.json());

// Connect to auth Redis
const clientAuth = redis.createClient({
  url: process.env.REDIS_AUTH_URL || "redis://localhost:6379"
});

// Connect to score Redis
const clientScore = redis.createClient({
  url: process.env.REDIS_SCORE_URL || "redis://localhost:6380"
});

(async () => {
  await clientAuth.connect();
  await clientScore.connect();
})();

// Endpoint to fetch user score
app.get('/getuserandscore', async (req, res) => {
  const { username } = req.query;
  try {
    // Username of user ID mapping is stored in auth Redis
    const userId = await clientAuth.get(`username:${username}`);
    if (!userId) {
      return res.status(404).send({ error: 'User not found' });
    }
    // Fetch score by user ID from score Redis
    const scoreData = await clientScore.hGet('players', userId);
    if (!scoreData) {
      return res.status(404).send({ error: 'Score not found' });
    }
    const { score, tries } = JSON.parse(scoreData);
    res.json({ username, score, tries });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error fetching data' });
  }
});

app.listen(3001, () => {
  console.log('Score service running on port 3001');
});
