import io from "socket.io-client";
import "../scss/index.scss";

let game = {};

const socket = io("http://localhost:3030");
const urlParams = new URLSearchParams(window.location.search);

socket.on("connect", () => console.log("Connected to WS"));

if (urlParams) {
  socket.emit("joinRoom", {
    user: { name: "User" + Math.random() },
    room: urlParams.get("game")
  });
}

socket.on("pairCompleted", () => console.log("Pair completed"));

socket.on("userJoined", data => {
  console.log(data);
});

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
