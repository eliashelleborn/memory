/* ===== LOBBY ===== */
export const addGameInfo = game => {
  const gameInfo = document.querySelector(".lobby__game-info");
  const template = `
    <ul>
      <li><span>Max Players:</span> ${game.settings.maxPlayers}</li>
      <li><span>Cards:</span> ${game.settings.pairs}</li>
    </ul>
  `;
  gameInfo.insertAdjacentHTML("afterbegin", template);
};

export const addPlayer = player => {
  const players = document.querySelector(".lobby__players");
  const template = `
    <div class='lobby__player' data-player='${player.id}'>
      <p>${player.name}</p>
      <p class='lobby__player-status'>${player.status}</p>
    </div>
  `;
  players.insertAdjacentHTML("beforeend", template);
};

export const removePlayer = id => {
  const player = document.querySelector(`[data-player='${id}']`);
  player.remove();
};

export const updatePlayerStatus = (player, status) => {};
