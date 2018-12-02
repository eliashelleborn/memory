import io from "socket.io-client";
import cards from "./cards";
import { createBoard, initGame } from "./game";
import {
  addLobbyPlayer,
  removeLobbyPlayer,
  updatePlayerStatus,
  addGameInfo,
  toggleLobby,
  updateCountdown,
  addGamePlayers
} from "./dom";

const socket = io("http://192.168.0.6:3030");
const urlParams = new URLSearchParams(window.location.search);

let gameStatus = "lobby";

socket.on("connect", () => {
  console.log("Connected");
  console.log(`Socket ID: ${socket.id}`);
});

// If correct URL params are given, try connecting to game room
if (urlParams) {
  socket.emit("join-room", {
    user: { name: urlParams.get("name") },
    room: urlParams.get("game")
  });
}

// Room responses on "join-room"
socket.on("room-joined", game => {
  addGameInfo(game);
  game.players.forEach(player => {
    addLobbyPlayer(player);
  });
});
socket.on("room-not-found", () => {
  const overlayError = document.querySelector(".overlay__error");
  overlayError.innerHTML = "<h3>Room Not Found</h3>";
  overlayError.classList.add("overlay__error--visible");
});
socket.on("room-already-started", () => {
  const overlayError = document.querySelector(".overlay__error");
  overlayError.innerHTML = `
      <div>
        <h3>Game has already started</h3>
        <p>You cannot join a game that has already started</p>
      </div>`;
  overlayError.classList.add("overlay__error--visible");
});
socket.on("room-full", () => {
  const overlayError = document.querySelector(".overlay__error");
  overlayError.innerHTML = `
      <div>
        <h3>Room is full</h3>
        <p>Maximum amount of players for this room has been reached. 
          <a href="javascript:window.location.href=window.location.href">Try again...</a>
        </p>
      </div>`;
  overlayError.classList.add("overlay__error--visible");
});

// Lobby events
socket.on("player-joined", player => {
  console.log("Player Joined");
  addLobbyPlayer(player);
});

socket.on("player-disconnected", id => {
  console.log("Player Disconnected");
  removeLobbyPlayer(id);

  if (gameStatus === "starting") toggleLobby();
});

const readyBtn = document.querySelector(".lobby__ready-btn");
readyBtn.addEventListener("click", () => {
  socket.emit("player-ready");
  updatePlayerStatus(socket.id, "ready");
});

socket.on("player-ready", player => {
  updatePlayerStatus(player.id, player.status);
});

socket.on("countdown", time => {
  if (time === 10) {
    gameStatus = "starting";
    toggleLobby();
  }
  updateCountdown(time);
});

// Game events
socket.on("game-setup", game => {
  createBoard(game.board);
  addGamePlayers(game, socket);
});

socket.on("game-started", () => {
  gameStatus = "started";
  initGame();
  console.log("Game started!");
});

/* const gameSetup = () => {
  let unusedCards = cards;

  cardElements.forEach(element => {
    const cardFront = element.querySelector(".card__front");
    const randNum = Math.floor(Math.random() * unusedCards.length);
    const randomCard = unusedCards[randNum];
    unusedCards.splice(randNum, 1);
    element.setAttribute("data-cardName", randomCard.name);
    cardFront.style.backgroundImage = `url(${randomCard.img})`;
  });
};

document.addEventListener("DOMContentLoaded", gameSetup());

let prevCard = null;
let completedPairs = 0;

const flipCard = card => {
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

const cardElements = document.querySelectorAll(".card");
cardElements.forEach(el => {
  el.addEventListener("click", ev => flipCard(ev.target));
});
 */
