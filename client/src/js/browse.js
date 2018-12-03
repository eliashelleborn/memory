import {
  addBrowseListItems,
  clearBrowseList,
  toggleJoinGameModal
} from "./dom";

let selectedGame = null;

const getGames = () => {
  fetch("http://localhost:3030/api/games")
    .then(res => res.json())
    .then(json => {
      addBrowseListItems(json);
      initEventListeners();
    });
};

const initEventListeners = () => {
  const listItemNodes = document.querySelectorAll(".browse__list-item");
  listItemNodes.forEach(item => {
    item.addEventListener("click", () => {
      const gameId = item.getAttribute("data-gameId");
      selectedGame = gameId;
      toggleJoinGameModal();
    });
  });
};

const joinBtn = document.querySelector(".modal__buttons button:first-child");
joinBtn.addEventListener("click", () => {
  const nicknameInput = document.querySelector(".modal__form input");
  window.location = `http://localhost:1234/mp-game.html?game=${selectedGame}&name=${
    nicknameInput.value
  }`;
});

const cancelBtn = document.querySelector(".modal__buttons button:last-child");
cancelBtn.addEventListener("click", () => {
  toggleJoinGameModal();
  selectedGame = null;
});

document.addEventListener("DOMContentLoaded", () => getGames());
document.querySelector(".browse__refresh").addEventListener("click", () => {
  clearBrowseList();
  getGames();
});
