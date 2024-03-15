const express = require('express');
const redis = require('redis');
const app = express();
app.use(express.json());

const redisClient = redis.createClient({ url: 'redis://default:password@localhost:6379' }); // Adjust as necessary
redisClient.connect();

// Record the score for a player
app.post('/setscore', async (req, res) => {
    const { player, score } = req.body;
    await redisClient.set(player, JSON.stringify(score));
    res.json({ message: `Score for ${player} is now ${score}` });
});

// Display the score of a player
app.get('/getscore/:player', async (req, res) => {
    const score = await redisClient.get(req.params.player);
    if (score) {
        res.json({ player: req.params.player, score: JSON.parse(score) });
    } else {
        res.status(404).send('Player not found');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Score service listening on port ${PORT}`));
