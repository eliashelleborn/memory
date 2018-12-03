import {
  createCard,
  updatePlayerClicks,
  updatePlayerProgress,
  updateTimer,
  displayFinishOverlay
} from "./dom";
import cards from "./cards";

let prevCard = null;
let completedPairs = 0;
let clicks = 0;
export let timer = null;

export const initGame = (game, socket) => {
  const cardNodes = document.querySelectorAll(".card");
  cardNodes.forEach(card => {
    card.addEventListener("click", () => clickHandler(card, game, socket));
  });
  startTimer(game.startTime);
};

const clickHandler = (card, game, socket) => {
  const cardName = card.getAttribute("data-cardName");
  const isMP = !!socket;

  card.classList.toggle("flipped");
  const flippedCards = document.querySelectorAll(".card.flipped");

  clicks++;
  if (isMP) socket.emit("player-clicked");
  updatePlayerClicks(socket.id, clicks);

  if (prevCard !== null) {
    if (cardName === prevCard) {
      completedPairs++;
      if (isMP) socket.emit("player-completed-pair");
      updatePlayerProgress(socket.id, completedPairs);
      completeCards(flippedCards);
      prevCard = null;

      if (completedPairs === game.settings.pairs) {
        socket.emit("player-finished");
      }
    } else {
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
