const express = require('express');
const redis = require('redis');

const app = express();

app.use(express.json());

// Configuration of Redis Cli
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});
client.connect();


// Endpoint to record player score
app.post('/setscore', (req, res) => {
  const { playerId, score, tries } = req.body;
  client.hset('players', playerId, JSON.stringify({ score, tries }));
  res.send('Score recorded successfully');
});

// Endpoint to display player score
app.get('/getscore', async (req, res) => {
  const playerId = req.query.playerId;
  try {
    const reply = await client.hGet('players', playerId);
    if (reply) {
      const { score, tries } = JSON.parse(reply);
      res.json({ score, tries });
    } else {
      res.status(404).send('Player not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching score');
  }
});


app.listen(3001, () => {
  console.log('Server running on port 3001');
});
