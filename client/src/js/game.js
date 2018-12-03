import {
  createCard,
  updatePlayerClicks,
  updatePlayerProgress,
  updateTimer,
  displayFinishOverlay,
  displaySPFinishOverlay
} from "./dom";
import cards from "./cards";

let prevCard = null;
let completedPairs = 0;
let clicks = 0;
export let timer = null;

let spStartTime = null;
let spTime = null;

const resetState = () => {
  spTime = null;
  spStartTime = null;
  clicks = 0;
  completedPairs = 0;
};

export const initGame = (game, socket) => {
  const isMP = !!socket;
  const cardNodes = document.querySelectorAll(".card");
  cardNodes.forEach(card => {
    card.addEventListener("click", () => clickHandler(card, game, socket));
  });

  if (isMP) {
    startTimer(game.startTime);
  }
};

// Click handler for both single- & multi-player
const clickHandler = (card, game, socket) => {
  const cardName = card.getAttribute("data-cardName");
  // If socket is null, game is singleplayer
  const isMP = !!socket;

  // If its the first click and game is singleplayer =>  start timer
  if (clicks === 0 && !isMP) {
    spStartTime = Date.now();
    startTimer(spStartTime);
  }

  clicks++;

  card.classList.toggle("flipped");
  const flippedCards = document.querySelectorAll(".card.flipped");

  if (isMP) {
    socket.emit("player-clicked");
    updatePlayerClicks(socket.id, clicks);
  }

  if (prevCard !== null) {
    if (cardName === prevCard) {
      completedPairs++;

      if (isMP) {
        socket.emit("player-completed-pair");
        updatePlayerProgress(socket.id, completedPairs);
      }

      completeCards(flippedCards);
      prevCard = null;

      if (completedPairs === game.settings.pairs) {
        if (isMP) {
          socket.emit("player-finished");
        } else {
          clearInterval(timer);
          displaySPFinishOverlay(spTime);
          resetState();
        }
      }
    } else {
      // Wait half a second before unflipping the cards, so you can see what you did.
      setTimeout(() => {
        unflipCards(flippedCards);
      }, 500);
      prevCard = null;
    }
  } else {
    prevCard = cardName;
  }
};

export const startTimer = startTime => {
  timer = setInterval(() => {
    const time = Date.now() - startTime;
    const formattedTime = (Math.round((time / 1000) * 10) / 10).toFixed(1);
    spTime = time;
    updateTimer(formattedTime);
  }, 100);
};

export const createBoard = board => {
  board.forEach(cardIndex => {
    createCard(cards[cardIndex]);
  });
};

export const unflipCards = cards => {
  cards.forEach(card => {
    card.classList.toggle("flipped");
  });
};

export const completeCards = cards => {
  cards.forEach(card => {
    card.classList.add("completed");
  });
  unflipCards(cards);
};
