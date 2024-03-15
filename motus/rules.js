$(document).ready(function() {
    let attempts = 5;
    let isWin = false;
    const answerInput = $("#wordInput");
    const feedbackDiv = $("#wordFeedback");
    const attemptsDiv = $("#attemptsLeft");
    let wordLength = 0;

    // Fetch word length at the start
    $.get('/word', function(data) {
        wordLength = data.length; // Assuming '/word' returns the word directly; adjust as needed
        $("#wordLength").text(`The word to guess has ${wordLength} letters.`);
    });

    // Checking the word and updating UI accordingly
    function checkWord() {
        if (attempts <= 0 || isWin) {
            alert("You've either won or exhausted all your attempts for today.");
            return;
        }

        const userWord = answerInput.val().trim();

        if (userWord.length !== wordLength) {
            alert(`Your word must have exactly ${wordLength} characters.`);
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/checkword', // Adjust port and route as necessary
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ word: userWord }),
            success: function(response) {
                // Assuming the response contains a flag indicating whether the guess is correct
                // and feedback to be displayed. Adjust according to your actual API response.
                displayFeedback(response.feedback);
                attempts--;
                attemptsDiv.text(`Attempts left: ${attempts}`);

                if (response.isCorrect) {
                    isWin = true;
                    alert("Congratulations! You've guessed the word correctly.");
                    setScore(1); // Assuming a win adds 1 to the score
                } else if (attempts === 0) {
                    alert("You've run out of attempts. Better luck next time!");
                    setScore(0); // Assuming a loss doesn't add to the score
                }
            },
            error: function(xhr, status, error) {
                console.error("Error checking word:", status, error);
            }
        });
    }

    // Update UI based on the feedback
    function displayFeedback(feedback) {
        feedbackDiv.html(feedback); // Directly setting HTML; ensure safe if feedback can be user-influenced
    }

    // Interacting with the score service
    function setScore(score) {
        // Assuming the score service expects a JSON with playerId, score, and tries
        $.ajax({
            url: 'http://localhost:3001/setscore', // Adjust port and route as necessary
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                playerId: "currentUserId", // Use actual user ID/session data
                score: score,
                tries: 5 - attempts
            }),
            success: function() {
                console.log("Score updated successfully.");
            },
            error: function(xhr, status, error) {
                console.error("Error updating score:", status, error);
            }
        });
    }

    // Binding the checkWord function to the Check button click event
    $("#checkButton").click(checkWord);

    // Optionally, handle Enter key press in the answer input field
    answerInput.keypress(function(event) {
        if (event.which === 13) { // Enter key
            event.preventDefault();
            checkWord();
        }
    });
});
