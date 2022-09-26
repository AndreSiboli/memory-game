//Creating the game
const grid = document.querySelector('.grid');

const characters = [
    'Garnet', 'Pearl', 'Amethyst',
    'Steven', 'Lapis_Lazuli', 'Rose_Quartz',
    'Greg', 'White_Diamond', 'Connie', 'Peridot'
];

const createElement = (tag, className) => {
    const element = document.createElement(tag)
    element.className = className;
    return element
}

const createCard = (character) => {
    const card = createElement('div', 'card')
    const front = createElement('div', 'face front')
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url(../images/${character}.png)`
    front.style.backgroundPosition = 'top center'

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard)
    card.setAttribute('data-character', character)

    return card
}

//Game 
let firstCard = '';
let secondCard = '';
const windowContainer = document.querySelector('.window-container')

const checkEndGame = () => {
    const disabledCard = document.querySelectorAll('.disabled-card');
    if (disabledCard.length == 20) {
        setTimeout(() => {
            clearInterval(countdownInterval)
            setScore()
            openWindow()

        }, 800)
    }
}

const checkCard = () => {
    const firstCharacter = firstCard.getAttribute('data-character')
    const secondCharacter = secondCard.getAttribute('data-character')

    if (firstCharacter == secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card')
        secondCard.firstChild.classList.add('disabled-card')

        firstCard = '';
        secondCard = '';

        checkEndGame()

    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card')
            secondCard.classList.remove('reveal-card')

            firstCard = '';
            secondCard = '';
        }, 500)
    }
    howMuchClicks()
}

const revealCard = ({
    target
}) => {
    if (target.parentNode.className.includes('reveal-card')) {
        return;
    }

    if (firstCard == '') {
        target.parentNode.classList.add('reveal-card')
        firstCard = target.parentNode;
    } else if (secondCard == '') {
        target.parentNode.classList.add('reveal-card')
        secondCard = target.parentNode;

        checkCard()
    }
}

const loadGame = () => {
    const duplicateCharacter = [...characters, ...characters]

    const shuffledArray = duplicateCharacter.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character)
        grid.appendChild(card)
    });
}

const playerNameDiv = document.querySelector('.playerName')
const playerName = localStorage.getItem('player')
playerNameDiv.innerHTML = playerName

//Countdown
const countDiv = document.querySelector('.count')
var count = 0;
var countM = 0;
var countStr;
var countMStr;

const countdown = () => {
    if (count > 59) {
        count = 0;
        countM += 1;
    }

    countStr = count
    countMStr = countM

    //Seconds
    if (count < 10) {
        countStr = `0${count}`
    }

    //Minutes
    if (countM < 10) {
        countMStr = `0${countM}`
    }

    if (countM == 59 && count == 59) {
        countDiv.textContent = `${countMStr}:${countStr}`
        clearInterval(countdownInterval)
        console.log('Passei mesmo', countM, count)
        return
    }

    countDiv.textContent = `${countMStr}:${countStr}`
    count++
};
var countdownInterval = setInterval(countdown, 1000)

//Clicks

const clicksDiv = document.querySelector('.clicks');
var clicks = 0;

const howMuchClicks = () => {
    clicks += 1
    clicksDiv.textContent = `${clicks}`
}

//Set Score

const setScore = () => {
    let currentPlayer = localStorage.getItem('player')
    let currentClicks = clicks
    let currentTime = `${countMStr}:${countStr}`.split(':')

    if (localStorage.getItem('time') == null) {
        let time = `${currentTime[0]}:${currentTime[1]}`
        setLocal(currentPlayer, time, currentClicks)
        return
    }

    //Best Play
    let bestPlay = localStorage.getItem('time').split(':')
    let time = `${currentTime[0]}:${currentTime[1]}`

    if (parseInt(currentTime[0]) < parseInt(bestPlay[0])) {
        setLocal(currentPlayer, time, currentClicks)
    } else if (parseInt(currentTime[0]) == parseInt(bestPlay[0])) {
        if (parseInt(currentTime[1]) < parseInt(bestPlay[1])) {
            setLocal(currentPlayer, time, currentClicks)
        }
    }
}

const setLocal = (player, time, clicks) => {
    localStorage.setItem('PlayerName', player)
    localStorage.setItem('time', time)
    localStorage.setItem('clicks', clicks)
}

//Reset

const resetVariables = () => {
    count = countM = clicks = 0;
    countStr = countMStr = '';
    countDiv.textContent = '00:00'
    clicksDiv.textContent = '0'
}

//OpenWindow

const openWindow = () => {
    console.log('appear')
    let bestTime = localStorage.getItem('time')
    let bestClicks = localStorage.getItem('clicks')
    let currentTime = `${countMStr}:${countStr}`
    let currentClicks = clicks
    let playerName = localStorage.getItem('PlayerName')

    const bestPlay = document.querySelector('.bestTries').children
    const lastPlay = document.querySelector('.lastTries').children

    bestPlay[0].textContent = 'Player: ' + playerName
    bestPlay[1].textContent = 'Tempo: ' + bestTime
    bestPlay[2].textContent = 'Tentativas: ' + bestClicks
    lastPlay[0].textContent = 'Player: ' + playerName
    lastPlay[1].textContent = 'Tempo: ' + currentTime
    lastPlay[2].textContent = 'Tentativas: ' + currentClicks

    windowContainer.style.display = 'flex'
}

//Try Again

const btnTry = document.querySelector('.tryAgain')

const tryAgain = () => {
    const allCards = document.querySelectorAll('.card')
    resetVariables()

    allCards.forEach(card => {
        document.querySelector('.grid').removeChild(card)
    })

    loadGame()
    countdownInterval = setInterval(countdown, 1000)
    windowContainer.style.display = 'none';
}

btnTry.addEventListener('click', tryAgain)

loadGame()