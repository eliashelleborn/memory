import { initGame } from "./game";
import { createCard, clearBoard, hideFinishOverlay } from "./dom";
import cards from "./cards";

const game = {
  board: null,
  settings: {
    pairs: 10
  }
};

const createBoardIndexes = pairCount => {
  const cards = Array.from(Array(pairCount).keys());
  const board = [...cards, ...cards];
  board.sort(() => Math.random() - 0.5);
  return board;
};

const createBoard = () => {
  game.board = createBoardIndexes(game.settings.pairs);
  game.board.forEach(cardIndex => {
    createCard(cards[cardIndex]);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
  initGame(game, null);
});

document.querySelector(".game__replay").addEventListener("click", () => {
  clearBoard();
  createBoard();
  hideFinishOverlay();
  initGame(game, null);
});
