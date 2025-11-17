const words = {
    programacion: ['javascript', 'python', 'html', 'css', 'programacion', 'desarrollo', 'web', 'juego', 'ahorcado', 'algoritmo', 'variable', 'funcion', 'clase', 'objeto', 'array', 'bucle', 'condicion', 'evento', 'dom', 'api'],
    animales: ['perro', 'gato', 'elefante', 'leon', 'tigre', 'oso', 'conejo', 'pajaro', 'pez', 'caballo', 'vaca', 'oveja', 'cerdo', 'gallina', 'pato', 'loro', 'tortuga', 'serpiente', 'araña', 'mariposa'],
    paises: ['españa', 'mexico', 'argentina', 'colombia', 'chile', 'peru', 'ecuador', 'venezuela', 'brasil', 'uruguay', 'paraguay', 'bolivia', 'cuba', 'puerto rico', 'panama', 'costa rica', 'nicaragua', 'honduras', 'el salvador', 'guatemala'],
    comida: ['pizza', 'hamburguesa', 'tacos', 'paella', 'gazpacho', 'churros', 'flan', 'tortilla', 'jamón', 'queso', 'pan', 'arroz', 'fideos', 'ensalada', 'sopa', 'carne', 'pescado', 'pollo', 'verduras', 'frutas']
};

const hangmanStages = [
    '',
    '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========\n¡Perdiste!'
];

let selectedWord = '';
let displayWord = [];
let wrongLetters = [];
let attemptsLeft = 6;
let score = 0;
let currentCategory = 'programacion';
let currentDifficulty = 'medio';

const wordDisplay = document.getElementById('word-display');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const attemptsDisplay = document.getElementById('attempts');
const scoreDisplay = document.getElementById('score');
const hangmanArt = document.getElementById('hangman-art');
const hintBtn = document.getElementById('hint-btn');
const newGameBtn = document.getElementById('new-game-btn');
const message = document.getElementById('message');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const keyboard = document.getElementById('keyboard');

function initGame() {
    currentCategory = categorySelect.value;
    currentDifficulty = difficultySelect.value;
    selectedWord = words[currentCategory][Math.floor(Math.random() * words[currentCategory].length)];
    displayWord = Array(selectedWord.length).fill('_');
    wrongLetters = [];
    attemptsLeft = getMaxAttempts();
    updateDisplay();
    message.textContent = '';
    resetKeyboard();
}

function getMaxAttempts() {
    switch (currentDifficulty) {
        case 'facil': return 8;
        case 'medio': return 6;
        case 'dificil': return 4;
        default: return 6;
    }
}

function updateDisplay() {
    wordDisplay.textContent = displayWord.join(' ');
    wrongLettersDisplay.textContent = 'Letras incorrectas: ' + wrongLetters.join(', ');
    attemptsDisplay.textContent = 'Intentos restantes: ' + attemptsLeft;
    scoreDisplay.textContent = 'Puntuación: ' + score;
    hangmanArt.textContent = hangmanStages[8 - attemptsLeft];
}

function guessLetter() {
    const letter = letterInput.value.toLowerCase();
    if (!letter || !/^[a-zñ]$/.test(letter)) {
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
        score += 10;
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

function giveHint() {
    if (attemptsLeft <= 1) {
        message.textContent = 'No tienes suficientes intentos para una pista.';
        return;
    }
    const hiddenLetters = selectedWord.split('').filter((letter, index) => displayWord[index] === '_');
    if (hiddenLetters.length === 0) {
        message.textContent = 'Ya has adivinado todas las letras.';
        return;
    }
    const hintLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === hintLetter) {
            displayWord[i] = hintLetter;
        }
    }
    attemptsLeft--;
    message.textContent = 'Pista usada. Se reveló una letra.';
    updateDisplay();
    checkGameEnd();
}

function checkGameEnd() {
    if (displayWord.join('') === selectedWord) {
        score += attemptsLeft * 5;
        message.textContent = '¡Felicidades! Has ganado. +' + (attemptsLeft * 5) + ' puntos extra.';
        disableAllKeys();
        hintBtn.disabled = true;
    } else if (attemptsLeft === 0) {
        message.textContent = 'Has perdido. La palabra era: ' + selectedWord;
        disableAllKeys();
        hintBtn.disabled = true;
    }
}

function resetKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'incorrect');
    });
}

function disableAllKeys() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.disabled = true;
    });
}

function handleKeyClick(event) {
    const letter = event.target.dataset.letter;
    if (!letter || event.target.disabled) return;

    event.target.disabled = true;

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
        score += 10;
        message.textContent = '¡Bien!';
        event.target.classList.add('correct');
    } else {
        wrongLetters.push(letter);
        attemptsLeft--;
        message.textContent = 'Letra incorrecta.';
        event.target.classList.add('incorrect');
    }

    updateDisplay();
    checkGameEnd();
}

guessBtn.addEventListener('click', guessLetter);
hintBtn.addEventListener('click', giveHint);
newGameBtn.addEventListener('click', () => {
    guessBtn.disabled = false;
    hintBtn.disabled = false;
    initGame();
});

letterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        guessLetter();
    }
});

keyboard.addEventListener('click', handleKeyClick);

categorySelect.addEventListener('change', initGame);
difficultySelect.addEventListener('change', initGame);

initGame();
