import cards from "./cards";

/* ===== LOBBY ===== */
export const addGameInfo = game => {
  const gameInfoNode = document.querySelector(".lobby__game-info");
  const template = `
    <ul>
      <li><span>Max Players:</span> ${game.settings.maxPlayers}</li>
      <li><span>Cards:</span> ${game.settings.pairs}</li>
    </ul>
  `;
  gameInfoNode.insertAdjacentHTML("afterbegin", template);
};

export const addLobbyPlayer = player => {
  const playersNode = document.querySelector(".lobby__players");
  const template = `
    <div class='lobby__player' data-player='${player.id}'>
      <p>${player.name}</p>
      <p class='lobby__player-status'>${player.status}</p>
    </div>
  `;
  playersNode.insertAdjacentHTML("beforeend", template);
};

export const removeLobbyPlayer = id => {
  const playerNode = document.querySelector(`[data-player='${id}']`);
  playerNode.remove();
};

export const updatePlayerStatus = (id, status) => {
  const statusNode = document.querySelector(
    `[data-player='${id}'] .lobby__player-status`
  );
  statusNode.classList.toggle("lobby__player-status--ready");
  statusNode.innerText = status;
};

export const toggleLobby = () => {
  const overlayNode = document.querySelector(".overlay");
  overlayNode.classList.toggle("overlay--hidden");
};

export const updateCountdown = time => {
  const countdownNode = document.querySelector(".game__countdown");
  countdownNode.firstChild.innerText = time;

  if (time == 0) {
    countdownNode.style.display = "none";
  }
};

/* ===== JOIN ROOM ERRORS ===== */
export const roomNotFound = () => {
  const overlayError = document.querySelector(".overlay__error");
  overlayError.innerHTML = "<h3>Room Not Found</h3>";
  overlayError.classList.add("overlay__error--visible");
};

export const gameAlreadyStarted = () => {
  const overlayError = document.querySelector(".overlay__error");
  overlayError.innerHTML = `
      <div>
        <h3>Game has already started</h3>
        <p>You cannot join a game that has already started</p>
      </div>`;
  overlayError.classList.add("overlay__error--visible");
};

export const roomFull = () => {
  const overlayError = document.querySelector(".overlay__error");
  overlayError.innerHTML = `
      <div>
        <h3>Room is full</h3>
        <p>Maximum amount of players for this room has been reached. 
          <a href="javascript:window.location.href=window.location.href">Try again...</a>
        </p>
      </div>`;
  overlayError.classList.add("overlay__error--visible");
};

/* ===== GAME ===== */
export const createCard = card => {
  const memoryNode = document.querySelector(".memory");
  const template = `
    <div class="card" data-cardName="${card.name}">
      <div class="card__front" style="background-image: url(${card.img})"></div>
      <div class="card__back"></div>
    </div>
  `;
  memoryNode.insertAdjacentHTML("beforeend", template);
};

export const addGamePlayers = (game, socket) => {
  game.players.forEach(player => {
    document
      .querySelector(".game__players")
      .insertAdjacentHTML(
        "beforeend",
        playerTemplate(player, player.id === socket.id, game.settings.pairs)
      );
  });
};

const playerTemplate = (player, isMe, pairCount) => {
  let progressBlocks = "";
  for (let i = 0; i < pairCount; i++) {
    progressBlocks += "<div></div>";
  }
  return `
    <div class="player" data-player="${player.id}">
      <div class="player__header">
        <h3 class="player__name">${player.name}</h3>
        <p class="player__you">${isMe ? "(You)" : ""}</p>
      </div>

      <div class="player__clicks">
        <span>Clicks: </span><span>0</span>
      </div>

      
      <div class="player__progress">
        <div class='player__progress-blocks'>
          ${progressBlocks}
        </div>
      </div>
    </div>
  `;
};

export const updatePlayerClicks = (player, clicks) => {
  const clicksNode = document.querySelector(
    `[data-player="${player}"] .player__clicks`
  );
  clicksNode.lastElementChild.innerText = clicks;
};

export const updatePlayerProgress = (player, pairsCompleted) => {
  const progressNode = document.querySelector(
    `[data-player="${player}"] .player__progress-blocks`
  );
  console.log(pairsCompleted);
  progressNode.children[pairsCompleted - 1].classList.add("completed");
};

export const updateTimer = time => {
  const timerNode = document.querySelector(
    ".game__timer > h2 > span:first-child"
  );
  timerNode.innerText = time;
};

export const displayFinishOverlay = (placement, time) => {
  const finishOverlayNode = document.querySelector(".game__finish-overlay");
  finishOverlayNode.classList.add("game__finish-overlay--open");
  finishOverlayNode.querySelector("p > span").innerText = (
    Math.round((time / 1000) * 10) / 10
  ).toFixed(1);

  if (placement === 0) {
    finishOverlayNode.querySelector("h1").innerText = "You Won!";
  } else {
    finishOverlayNode.querySelector(
      "h1"
    ).innerText = `You finished in #${placement + 1} place.`;
  }
};
