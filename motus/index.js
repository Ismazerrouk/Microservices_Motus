const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const cors = require('cors');
app.use(cors());

const fs = require('fs');

const frenchWordsFilePath = 'data/liste_francais_utf8.txt';
try {
  const frenchWordsData = fs.readFileSync(frenchWordsFilePath, 'utf8');
  const frenchWordsArray = frenchWordsData.split('\n');
  if (frenchWordsArray.length === 0) {
    throw new Error('French words array is empty.');
  }
  //console.log(`French words array length: ${frenchWordsArray.length}`);
  frenchwords = frenchWordsArray;
} catch (err) {
  console.error('Error reading French words file:', err);
}

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('static'));

app.get('/port', (req, res) => {
  const os = require('os');
  const hostname = os.hostname();
  // Renvoie le système d'exploitation et le port d'écoute
  res.send(`MOTUS APP working on ${hostname} port ${port}`);
});

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * frenchwords.length);
  return frenchwords[randomIndex];
}
let selectedWord;

function selectWordOfTheDay() {
  selectedWord = getRandomWord();
}
selectWordOfTheDay();

app.get('/word', (req, res) => {
  if (selectedWord) {
    const wordLength = selectedWord.length;
    res.json({ wordLength });
  } else {
    res.status(500).send('No word today.');
  }
});

app.post('/checkword', (req, res) => {
  const word = req.body.word;
  const targetWord = selectedWord;
  let feedback = '';
  let correctPositions = [];

  for (let i = 0; i < word.length; i++) {
    if (word[i] === targetWord[i]) {
      feedback += '<span style="background-color: green">' + word[i] + '</span>';
      correctPositions.push(i);
    } else if (targetWord.includes(word[i])) {
      feedback += '<span style="background-color: orange">' + word[i] + '</span>';
    } else {
      feedback += '_';
    }
  }

  res.json({ feedback, correctPositions });
});

// In-memory storage for demonstration
let scores = {};

// Endpoint to set score for a player
app.post('/setscore', (req, res) => {
  const { player, score } = req.body;
  scores[player] = score;
  res.json({ message: `Score for ${player} is now ${score}` });
});

// Endpoint to get score for a player
app.get('/getscore/:player', (req, res) => {
  const { player } = req.params;
  const score = scores[player];
  if (score !== undefined) {
    res.json({ player, score });
  } else {
    res.status(404).send('Player not found');
  }
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});