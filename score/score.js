const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient();

// Endpoint to record player score
app.post('/setscore', (req, res) => {
  const { playerId, score, tries } = req.body;
  client.hset('players', playerId, JSON.stringify({ score, tries }));
  res.send('Score recorded successfully');
});

// Endpoint to display player score
app.get('/getscore', (req, res) => {
  const playerId = req.query.playerId;
  client.hget('players', playerId, (err, reply) => {
    if (err) {
      res.status(500).send('Error fetching score');
    } else if (reply) {
      const { score, tries } = JSON.parse(reply);
      res.json({ score, tries });
    } else {
      res.status(404).send('Player not found');
    }
  });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
