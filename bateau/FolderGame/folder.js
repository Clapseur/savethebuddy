const container = document.body;
const squareSize = 50;
const interval = 1000;
let score = 0;

function countScore() {
    const scoreElement = document.querySelector('.score');
    if (scoreElement) {
        scoreElement.innerHTML = score;
    }
}

countScore();

function handleRedSquareClick(square) {
    let isClicked = false;
    square.addEventListener("click", () => {
        isClicked = true;
        score += 1;
        countScore();
        square.remove();
    });
    setTimeout(() => {
        if (!isClicked) {
            console.log("fail");
            square.remove();
        }
    }, 800);
}

function handleGreenSquareClick(square) {
    let isClicked = false;
    square.addEventListener("click", () => {
        isClicked = true;
        console.log("fail");
        square.remove();
    });
    setTimeout(() => {
        if (!isClicked) {
            square.remove();
        }
    }, 5000);
}

function createRandomSquare() {
    const square = document.createElement("div");
    if (Math.random() > 0.65) {
        square.classList.add("red-square");
        handleRedSquareClick(square);
    } else {
        square.classList.add("green-square");
        handleGreenSquareClick(square);       
    }
    const x = Math.random() * (window.innerWidth - squareSize);
    const y = Math.random() * (window.innerHeight - squareSize);
    square.style.left = `${x}px`;
    square.style.top = `${y}px`;
    container.appendChild(square);
}

setInterval(createRandomSquare, interval);