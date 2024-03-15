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

// Route pour l'application Motis
// app.get('/', async (req, res) => {
//     // Logic to fetch user score history (using score microservice)
//     const username = req.session.username; // Assuming you have username in session
//     let scoreHistory;
//     try {
//         const response = await fetch(`http://localhost:3001/getuserandscore?username=${username}`);
//         scoreHistory = await response.json();
//     } catch (err) {
//         console.error('Error fetching score history:', err);
//         scoreHistory = { error: 'Failed to retrieve score history' };
//     }

//     // Render index.html with score history data (e.g., using templating engine like EJS)
//     res.render('index', { scoreHistory });  // Assuming you have an EJS template
// });

// app.listen(3000, () => {
//     console.log('Motus server listening on port 3000');
// });

app.post('/checkword', async (req, res) => {
    let feedback = '';
    let correctPositions = [];
    const word = req.body.word;
    let isCorrect = true; // Assume true, prove false

    for (let i = 0; i < word.length; i++) {
        if (word[i] === wordOfTheDay[i]) {
            feedback += '<span style="background-color: green">' + word[i] + '</span>';
            correctPositions.push(i);
        } else if (wordOfTheDay.includes(word[i])) {
            feedback += '<span style="background-color: orange">' + word[i] + '</span>';
            isCorrect = false; // Not fully correct
        } else {
            feedback += '<span class="empty">_</span>';
            isCorrect = false; // Not fully correct
        }
    }

    res.json({ feedback, correctPositions, isCorrect }); // Include isCorrect flag
});

app.get('/ViewScoreHistory', (req, res) => {
    return res.redirect('http://localhost:3001')
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