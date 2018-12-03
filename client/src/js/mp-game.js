import io from "socket.io-client";
import cards from "./cards";
import { createBoard, unflipCards, completeCards, initGame } from "./game";
import {
  addLobbyPlayer,
  removeLobbyPlayer,
  updatePlayerStatus,
  addGameInfo,
  toggleLobby,
  updateCountdown,
  addGamePlayers,
  updatePlayerClicks,
  updatePlayerProgress,
  roomNotFound,
  gameAlreadyStarted,
  roomFull
} from "./dom";

const socket = io("http://localhost:3030");
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
socket.on("room-not-found", () => roomNotFound());
socket.on("room-already-started", () => gameAlreadyStarted());
socket.on("room-full", () => roomFull());

/* ===== LOBBY EVENTS ===== */
socket.on("player-joined", player => {
  addLobbyPlayer(player);
});

socket.on("player-disconnected", id => {
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
  if (time === 3) {
    gameStatus = "starting";
    toggleLobby();
  }
  updateCountdown(time);
});

/* ===== GAME EVENTS ===== */
socket.on("game-setup", game => {
  createBoard(game.board);
  addGamePlayers(game, socket);
});

socket.on("game-started", () => {
  gameStatus = "started";
  initGame(socket);
});

socket.on("player-clicked", ({ player, clicks }) => {
  updatePlayerClicks(player, clicks);
});

socket.on("player-completed-pair", ({ player, pairsCompleted }) => {
  updatePlayerProgress(player, pairsCompleted);
});

/*
const cardElements = document.querySelectorAll(".card");
cardElements.forEach(el => {
  el.addEventListener("click", ev => flipCard(ev.target));
});
 */
