const words = [
    { answer: "BRIDGE", images: ["images/bridge1.jpg", "images/bridge2.jpg", "images/bridge3.jpg", "images/bridge4.jpg"] },
    { answer: "PLANET", images: ["images/planet1.jpg", "images/planet2.jpg", "images/planet3.jpg", "images/planet4.jpg"] },
    { answer: "LANTERN", images: ["images/lantern1.jpg", "images/lantern2.jpg", "images/lantern3.jpg", "images/lantern4.jpg"] }
];

let currentIndex = 0;
let currentWord = words[currentIndex].answer;
let selectedLetters = [];
let score = 0;

const wordContainer = document.getElementById("word-container");
const lettersContainer = document.getElementById("letters-container");
const scoreDisplay = document.getElementById("score");

function loadLevel() {
    currentWord = words[currentIndex].answer;
    selectedLetters = [];
    wordContainer.innerHTML = "";
    lettersContainer.innerHTML = "";

    document.querySelectorAll(".clue-img").forEach((img, index) => {
        img.src = words[currentIndex].images[index];
    });

    for (let i = 0; i < currentWord.length; i++) {
        const letterBox = document.createElement("div");
        letterBox.classList.add("letter-box");
        letterBox.dataset.index = i;
        wordContainer.appendChild(letterBox);
    }

    let shuffledLetters = currentWord.split("");
    while (shuffledLetters.length < 12) {
        shuffledLetters.push(String.fromCharCode(65 + Math.floor(Math.random() * 26))); 
    }
    shuffledLetters = shuffledLetters.sort(() => Math.random() - 0.5);

    // Create letter choice elements in two rows
    const topRow = document.createElement("div");
    topRow.classList.add("letter-row");
    const bottomRow = document.createElement("div");
    bottomRow.classList.add("letter-row");

    shuffledLetters.forEach((letter, index) => {
        const letterDiv = document.createElement("div");
        letterDiv.classList.add("letter");
        letterDiv.textContent = letter;
        letterDiv.addEventListener("click", () => selectLetter(letter, letterDiv));

        if (index < 6) {
            topRow.appendChild(letterDiv);
        } else {
            bottomRow.appendChild(letterDiv); 
        }
    });

    lettersContainer.appendChild(topRow);
    lettersContainer.appendChild(bottomRow);
}
function selectLetter(letter) {
    const letterElements = document.querySelectorAll(".letter");

    // Find the corresponding letter element (if exists and not used)
    let element = Array.from(letterElements).find(
        (el) => el.textContent === letter && !el.classList.contains("used")
    );

    if (!element) return; // If no valid letter found, exit

    if (selectedLetters.length < currentWord.length) {
        selectedLetters.push(letter);

        // Fill the next available empty box
        const emptyBox = document.querySelector(".letter-box:not(.filled)");
        if (emptyBox) {
            emptyBox.textContent = letter;
            emptyBox.classList.add("filled");
            element.classList.add("used"); 
            element.style.background = "#555"; 
            element.style.pointerEvents = "none"; 
        }
    }
    checkAnswer();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {

        const filledBoxes = document.querySelectorAll(".letter-box.filled");
        if (filledBoxes.length > 0) {
            const lastBox = filledBoxes[filledBoxes.length - 1];
            const removedLetter = lastBox.textContent;

            // Clear the box
            lastBox.textContent = "";
            lastBox.classList.remove("filled");

            const index = selectedLetters.indexOf(removedLetter);
            if (index !== -1) selectedLetters.splice(index, 1);


            const letterElements = document.querySelectorAll(".letter");
            let letterElement = Array.from(letterElements).find(
                (el) => el.textContent === removedLetter && el.classList.contains("used")
            );

            if (letterElement) {
                letterElement.classList.remove("used");
                letterElement.style.background = "";
                letterElement.style.pointerEvents = "auto";
            }
        }
    }
});

function checkAnswer() {
    if (selectedLetters.join("") === currentWord) {
        score++;
        scoreDisplay.textContent = "Score: " + score;

        setTimeout(() => {
            wordContainer.classList.remove("word-correct");
            nextLevel();
        }, 500);
    }
}

function nextLevel() {
    const levelUpSound = new Audio("./sounds/upgrade_level.wav.wav");
    const gameFinished = new Audio("./sounds/level_completed.wav");
    if (currentIndex < words.length - 1) {
        levelUpSound.play();
        currentIndex++;
        loadLevel();
    } else {
        gameFinished.play();
        setTimeout(() => {
            alert("Congratulations! You've completed all levels.");
            resetGame();
        }, 1000); // time delay
    }
}

function resetGame() {
    selectedLetters = []; // Clear selected letters
    wordContainer.innerHTML = ""; // Clear the displayed answer boxes
    
    // Recreate empty answer boxes
    for (let i = 0; i < currentWord.length; i++) {
        const letterBox = document.createElement("div");
        letterBox.classList.add("letter-box");
        letterBox.dataset.index = i;
        wordContainer.appendChild(letterBox);
    }

    //pang shuffle
    document.querySelectorAll(".letter").forEach(letter => {
        letter.classList.remove("used"); 
        letter.style.background = ""; 
        letter.style.pointerEvents = "auto"; 
    });
    // resets back to lvl 1
    currentIndex = 0;
    score = 0;
    scoreDisplay.textContent = "Score: " + score;
    loadLevel();
}

function resetLevel() {
    selectedLetters = []; // Clear selected letters
    wordContainer.innerHTML = ""; // Clear letter boxes
    lettersContainer.innerHTML = ""; // Clear letter choices

    // Recreate empty letter boxes
    for (let i = 0; i < currentWord.length; i++) {
        const letterBox = document.createElement("div");
        letterBox.classList.add("letter-box");
        letterBox.dataset.index = i;
        wordContainer.appendChild(letterBox);
    }

    // Shuffle letters and regenerate choices
    let shuffledLetters = currentWord.split("");
    while (shuffledLetters.length < 12) {
        shuffledLetters.push(String.fromCharCode(65 + Math.floor(Math.random() * 26))); 
    }
    shuffledLetters = shuffledLetters.sort(() => Math.random() - 0.5);

    // Create new letter choice elements
    const topRow = document.createElement("div");
    topRow.classList.add("letter-row");
    const bottomRow = document.createElement("div");
    bottomRow.classList.add("letter-row");

    shuffledLetters.forEach((letter, index) => {
        const letterDiv = document.createElement("div");
        letterDiv.classList.add("letter");
        letterDiv.textContent = letter;
        letterDiv.addEventListener("click", () => selectLetter(letter, letterDiv));

        if (index < 6) {
            topRow.appendChild(letterDiv);
        } else {
            bottomRow.appendChild(letterDiv);
        }
    });

    lettersContainer.appendChild(topRow);
    lettersContainer.appendChild(bottomRow);
}

document.getElementById("reset-button").addEventListener("click", resetLevel);
document.addEventListener("keydown", (event) => {
    let pressedKey = event.key.toUpperCase(); // Convert to uppercase

    if (pressedKey.match(/^[A-Z]$/)) { // Ensure only letters (A-Z)
        selectLetter(pressedKey);
    }
});
document.querySelectorAll(".letter").forEach((letterDiv) => {
    letterDiv.addEventListener("click", () => selectLetter(letterDiv.textContent));
});
loadLevel();