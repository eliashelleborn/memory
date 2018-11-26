const getGames = () => {
  fetch("http://localhost:3030/api/games")
    .then(res => res.json())
    .then(json => console.log(json));
};

getGames();
