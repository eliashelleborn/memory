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

export const addPlayer = player => {
  const playersNode = document.querySelector(".lobby__players");
  const template = `
    <div class='lobby__player' data-player='${player.id}'>
      <p>${player.name}</p>
      <p class='lobby__player-status'>${player.status}</p>
    </div>
  `;
  playersNode.insertAdjacentHTML("beforeend", template);
};

export const removePlayer = id => {
  const playerNode = document.querySelector(`[data-player='${id}']`);
  playerNode.remove();
};

export const updatePlayerStatus = (id, status) => {
  const statusNode = document.querySelector(
    `[data-player='${id}'] .lobby__player-status`
  );
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

/* ===== GAME ===== */
export const createCard = card => {
  const memoryNode = document.querySelector(".memory");
  const template = `
    <div class="card">
      <div class="card__front"></div>
      <div class="card__back"></div>
    </div>
  `;
  memoryNode.insertAdjacentHTML("beforeend", template);
};
