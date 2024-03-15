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
    let nb_try = 0;
    let success = 0;
    const word = req.body.word;

    let feedback = '';
    if (word === wordOfTheDay){
        success++;
    }
    nb_try++;

    

    for (let i = 0; i < word.length; i++) {
        if (word[i] === wordOfTheDay[i]) {
            feedback += '<span style="background-color: green">' + word[i] + '</span>';
        } else if (wordOfTheDay.includes(word[i])) {
            feedback += '<span style="background-color: orange">' + word[i] + '</span>';
        } else {
            feedback += word[i];
        }
        }

        // Envoie du feedback en réponse
        res.send({ message: feedback });

        // Envoi des données à une autre application Node.js avec fetch
    const scoreData = {
        nb_try: nb_try,
        success: success,
        // Ajoutez d'autres données si nécessaire
    };

    fetch('http://localhost:3001/setscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score enregistré avec succès :', data);
    })
    .catch(error => {
        console.error('Erreur lors de l\'enregistrement du score :', error);
    });

});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
    
});

app.get('/port', (req, res) => {
    const os = require('os');
    res.send(`The app is working with os: ${os} on port: ${port}`)
});
 

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});