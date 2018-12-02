import { createCard } from "./dom";

export const initGame = () => {
  const cardNodes = document.querySelectorAll(".card");
  cardNodes.forEach(card => {
    card.addEventListener("click", () => clickHandler(card));
  });
};

let prevCard = null;
let completedPairs = 0;

export const createBoard = cards => {
  cards.forEach(cardIndex => {
    createCard(cards[cardIndex]);
  });
};

export const clickHandler = card => {
  const cardName = card.getAttribute("data-cardName");

  card.classList.toggle("flipped");
  const flippedCards = document.querySelectorAll(".card.flipped");

  if (prevCard !== null) {
    if (cardName === prevCard) {
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

const unflipCards = cards => {
  console.log("Unflip");
  cards.forEach(card => {
    card.classList.toggle("flipped");
  });
};

const completeCards = cards => {
  console.log("Complete");
  socket.emit("pairCompleted");
  cards.forEach(card => {
    card.classList.add("completed");
  });
  completedPairs++;
  unflipCards(cards);
  if (completedPairs === 3) alert("YOU WIN!");
};
