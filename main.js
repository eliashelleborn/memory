const cards = [
  {
    name: "sigma",
    img: "https://img.icons8.com/dusk/64/000000/sigma.png"
  },
  {
    name: "sigma",
    img: "https://img.icons8.com/dusk/64/000000/sigma.png"
  },
  {
    name: "pi",
    img: "https://img.icons8.com/dusk/64/000000/pi.png"
  },
  {
    name: "pi",
    img: "https://img.icons8.com/dusk/64/000000/pi.png"
  },
  {
    name: "gamma",
    img: "https://img.icons8.com/dusk/64/000000/gamma.png"
  },
  {
    name: "gamma",
    img: "https://img.icons8.com/dusk/64/000000/gamma.png"
  }
];

const gameSetup = () => {
  const cardElements = document.querySelectorAll(".card");

  let unusedCards = cards;

  cardElements.forEach(element => {
    const randNum = Math.floor(Math.random() * unusedCards.length);
    const randomCard = unusedCards[randNum];
    unusedCards.splice(randNum, 1);
    element.setAttribute("data-cardName", randomCard.name);
    element.innerText = randomCard.name;
    console.log(unusedCards);
  });
};

document.addEventListener("DOMContentLoaded", gameSetup());
