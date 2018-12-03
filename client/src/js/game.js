import { createCard, updatePlayerClicks, updatePlayerProgress } from "./dom";
import cards from "./cards";

let prevCard = null;
let completedPairs = 0;
let clicks = 0;

export const initGame = socket => {
  const cardNodes = document.querySelectorAll(".card");
  cardNodes.forEach(card => {
    card.addEventListener("click", () => clickHandler(card, socket));
  });
};

const clickHandler = (card, socket) => {
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

export const createBoard = board => {
  board.forEach(cardIndex => {
    createCard(cards[cardIndex]);
  });
};

export const unflipCards = cards => {
  console.log("Unflip");
  cards.forEach(card => {
    card.classList.toggle("flipped");
  });
};

export const completeCards = cards => {
  console.log("Complete");
  cards.forEach(card => {
    card.classList.add("completed");
  });
  unflipCards(cards);
  if (completedPairs === 3) alert("YOU WIN!");
};
