//const isAuthenticated = require('../auth/auth.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;
const fs = require('fs');
const fetch = require('cross-fetch');

//const fetch = require('node-fetch');

app.use(express.static('static'));
app.use(express.json());


// Lecture du fichier texte de manière asynchrone
const frenchwords = fs.readFileSync('data/liste_francais_utf8.txt', 'utf8').split('\n');

    // Exemple : Création d'un tableau à partir des lignes
const tableau = frenchwords.map(frenchwords => frenchwords.trim()); // Supprimer les espaces inutiles

const seedrandom = require('seedrandom');

// Générer le nombre aléatoire une fois pour la journée
const date = new Date();
const seed = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const rng = seedrandom(seed);
const randomNumber = Math.floor(rng() * tableau.length);

// Utiliser le nombre aléatoire pour obtenir le mot correspondant
const wordOfTheDay = tableau[randomNumber];

// Route pour afficher le contenu
app.get('/word', (req, res) => {
    res.send(`Hello, the word of the day is: ${wordOfTheDay}`)
});


app.post('/checkword', async (req, res) => {
    let feedback = '';
    let correctPositions = []; // Initialize correctPositions as an empty array
    const word = req.body.word;

    for (let i = 0; i < word.length; i++) {
        if (word[i] === wordOfTheDay[i]) { // Use wordOfTheDay instead of targetWord
            feedback += '<span style="background-color: green">' + word[i] + '</span>';
            correctPositions.push(i);
        } else if (wordOfTheDay.includes(word[i])) { // Use wordOfTheDay instead of targetWord
            feedback += '<span style="background-color: orange">' + word[i] + '</span>';
        } else {
            feedback += '_';
        }
    }

    // Assuming you want to return some response to the client
    res.json({ feedback, correctPositions });
});


// Commented out section moved to 'score' microservice
/*
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
*/

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});