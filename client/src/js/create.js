const createBtn = document.querySelector(".create__button");

createBtn.addEventListener("click", () => {
  const gameNameInput = document.querySelector(".create__game-name input");
  const playersInput = document.querySelector(".create__players input");
  const pairsInput = document.querySelector(".create__pairs input");
  const nicknameInput = document.querySelector(".create__footer input");
  const data = {
    name: gameNameInput.value,
    maxPlayers: playersInput.value,
    pairs: pairsInput.value
  };
  fetch("http://localhost:3030/api/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(json => {
      if (json.errorMessage) {
        console.log(json.errorMessage);
      } else {
        window.location = `mp-game.html?game=${json.id}&name=${
          nicknameInput.value
        }`;
      }
    });
});
