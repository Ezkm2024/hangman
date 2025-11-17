const words = ['javascript', 'python', 'html', 'css', 'programacion', 'desarrollo', 'web', 'juego', 'ahorcado', 'letra'];

let selectedWord = '';
let displayWord = [];
let wrongLetters = [];
let attemptsLeft = 6;

const wordDisplay = document.getElementById('word-display');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const attemptsDisplay = document.getElementById('attempts');
const letterInput = document.getElementById('letter-input');
const guessBtn = document.getElementById('guess-btn');
const newGameBtn = document.getElementById('new-game-btn');
const message = document.getElementById('message');

function initGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord = Array(selectedWord.length).fill('_');
    wrongLetters = [];
    attemptsLeft = 6;
    updateDisplay();
    message.textContent = '';
    letterInput.value = '';
    letterInput.focus();
}

function updateDisplay() {
    wordDisplay.textContent = displayWord.join(' ');
    wrongLettersDisplay.textContent = 'Letras incorrectas: ' + wrongLetters.join(', ');
    attemptsDisplay.textContent = 'Intentos restantes: ' + attemptsLeft;
}

function guessLetter() {
    const letter = letterInput.value.toLowerCase();
    if (!letter || !/^[a-z]$/.test(letter)) {
        message.textContent = 'Por favor, ingresa una letra válida.';
        return;
    }
    if (displayWord.includes(letter) || wrongLetters.includes(letter)) {
        message.textContent = 'Ya has adivinado esa letra.';
        return;
    }

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                displayWord[i] = letter;
            }
        }
        message.textContent = '¡Bien!';
    } else {
        wrongLetters.push(letter);
        attemptsLeft--;
        message.textContent = 'Letra incorrecta.';
    }

    updateDisplay();
    checkGameEnd();
    letterInput.value = '';
}

function checkGameEnd() {
    if (displayWord.join('') === selectedWord) {
        message.textContent = '¡Felicidades! Has ganado.';
        guessBtn.disabled = true;
    } else if (attemptsLeft === 0) {
        message.textContent = 'Has perdido. La palabra era: ' + selectedWord;
        guessBtn.disabled = true;
    }
}

guessBtn.addEventListener('click', guessLetter);
newGameBtn.addEventListener('click', () => {
    guessBtn.disabled = false;
    initGame();
});

letterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        guessLetter();
    }
});

initGame();
