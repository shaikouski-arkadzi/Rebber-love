const girls = [
  {
    name: "Rubber Octokuro",
    city: "Я звезда!",
    image: "./images/01 Rubber Octokuro.jpg",
  },

  {
    name: "Rubber Olivia",
    city: "Люблю вкусно готовить",
    image: "./images/02 Rubber Olivia.jpg",
  },

  {
    name: "Silent Girl",
    city: "Люблю помолчать. помечтать...",
    image: "./images/03 Silent Girl.JPG",
  },

  {
    name: "Pink Rubber Dru",
    city: "Мне почему-то не везет с парнями...",
    image: "./images/04 Pink Rubber Dru.jpg",
  },

  {
    name: "Red Latex Queen",
    city: "Я снова с вами!",
    image: "./images/05 Red Latex Queen.jpg",
  },

  {
    name: "Rubber Dolly",
    city: "Хочу надувать и лопать шарики!",
    image: "./images/06 Rubber Dolly.png",
  },

  {
    name: "Rubber Maid",
    city: "За чистоту и порядок в доме!",
    image: "./images/07 Rubber Maid.jpg",
  },

  {
    name: "Red Rubber Dru",
    city: "Сегодня на чиле, на расслабоне...",
    image: "./images/08 Red Rubber Dru.JPG",
  },

  {
    name: "White Kitty",
    city: "Мяу!",
    image: "./images/09 White Kitty.jpg",
  },

  {
    name: "Rubber Violetta",
    city: "Выпустите меня, суки! Я хочу на свидание!",
    image: "./images/10 Rubber Violetta.jpg",
  },

  {
    name: "Mistress Lidia",
    city: "Объявляю новый набор рабов!",
    image: "./images/11 Mistress Lidia.jpg",
  },

  {
    name: "Red Foxy",
    city: "Встречусь! Сегодня! В Wrapa's Dungeon!",
    image: "./images/12 Alt FINAL Red Foxy.jpg",
  },
];

const cardsContainer = document.getElementById("cardsContainer");

const likeButton = document.getElementById("likeButton");

const dislikeButton = document.getElementById("dislikeButton");

const matchOverlay = document.getElementById("matchOverlay");

const continueButton = document.getElementById("continueButton");

let currentIndex = 0;

let isDragging = false;

let startX = 0;
let currentX = 0;

let activeCard = null;

/*
|--------------------------------------------------------------------------
| RENDER
|--------------------------------------------------------------------------
*/

function renderCards() {
  cardsContainer.innerHTML = "";

  /*
   * Показываем максимум 2 карточки.
   * Вторая находится под первой.
   */

  for (
    let i = currentIndex;
    i < Math.min(currentIndex + 2, girls.length);
    i++
  ) {
    const girl = girls[i];

    const card = createCard(girl, i);

    cardsContainer.appendChild(card);
  }

  activeCard = cardsContainer.querySelector(
    ".card[data-index='" + currentIndex + "']",
  );

  if (activeCard) {
    addDragEvents(activeCard);
  }
}

/*
|--------------------------------------------------------------------------
| CREATE CARD
|--------------------------------------------------------------------------
*/

function createCard(girl, index) {
  const card = document.createElement("div");

  card.className = "card";

  card.dataset.index = index;

  /*
   * Верхняя карточка должна быть выше.
   */

  card.style.zIndex = girls.length - index;

  card.innerHTML = `

        <img
            src="${girl.image}"
            alt="${girl.name}"
            draggable="false"
        >

        <div class="swipe-label like">
            LIKE
        </div>

        <div class="swipe-label dislike">
            NOPE
        </div>

        <div class="card-info">

            <h2>
                ${girl.name}
            </h2>

            <p>
                ${girl.city}
            </p>

        </div>
    `;

  return card;
}

/*
|--------------------------------------------------------------------------
| DRAG
|--------------------------------------------------------------------------
*/

function addDragEvents(card) {
  card.addEventListener("pointerdown", startDrag);

  card.addEventListener("pointermove", drag);

  card.addEventListener("pointerup", endDrag);

  card.addEventListener("pointercancel", endDrag);
}

function startDrag(event) {
  if (matchOverlay.classList.contains("active")) {
    return;
  }

  isDragging = true;

  startX = event.clientX;

  currentX = 0;

  activeCard = event.currentTarget;

  activeCard.setPointerCapture(event.pointerId);

  activeCard.style.transition = "none";
}

function drag(event) {
  if (!isDragging || !activeCard) {
    return;
  }

  currentX = event.clientX - startX;

  const rotation = currentX * 0.08;

  activeCard.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;

  updateLabels();
}

function endDrag() {
  if (!isDragging || !activeCard) {
    return;
  }

  isDragging = false;

  activeCard.style.transition = "transform 0.3s ease, opacity 0.3s ease";

  const threshold = 120;

  if (currentX > threshold) {
    swipe("right");
  } else if (currentX < -threshold) {
    swipe("left");
  } else {
    activeCard.style.transform = "translateX(0) rotate(0)";

    resetLabels();
  }
}

/*
|--------------------------------------------------------------------------
| LABELS
|--------------------------------------------------------------------------
*/

function updateLabels() {
  if (!activeCard) {
    return;
  }

  const likeLabel = activeCard.querySelector(".swipe-label.like");

  const dislikeLabel = activeCard.querySelector(".swipe-label.dislike");

  if (currentX > 0) {
    likeLabel.style.opacity = Math.min(currentX / 100, 1);

    dislikeLabel.style.opacity = 0;
  } else {
    dislikeLabel.style.opacity = Math.min(Math.abs(currentX) / 100, 1);

    likeLabel.style.opacity = 0;
  }
}

function resetLabels() {
  if (!activeCard) {
    return;
  }

  activeCard.querySelector(".swipe-label.like").style.opacity = 0;

  activeCard.querySelector(".swipe-label.dislike").style.opacity = 0;
}

/*
|--------------------------------------------------------------------------
| SWIPE
|--------------------------------------------------------------------------
*/

function swipe(direction) {
  if (!activeCard) {
    return;
  }

  /*
   * ВАЖНО:
   *
   * currentIndex начинается с 0.
   *
   * 6-я девушка имеет index === 5.
   *
   * Поэтому именно при свайпе шестой карточки
   * показываем Match независимо от direction.
   */

  const isSixthGirl = currentIndex === 11;

  const offset = direction === "right" ? window.innerWidth : -window.innerWidth;

  activeCard.style.transition = "transform 0.45s ease, opacity 0.45s ease";

  activeCard.style.transform = `translateX(${offset}px) rotate(${direction === "right" ? 25 : -25}deg)`;

  activeCard.style.opacity = "0";

  setTimeout(() => {
    /*
     * Шестая девушка всегда вызывает Match.
     */

    if (isSixthGirl) {
      showMatch();

      return;
    }

    /*
     * Переходим к следующей девушке.
     */

    currentIndex++;

    renderCards();
  }, 450);
}

/*
|--------------------------------------------------------------------------
| BUTTONS
|--------------------------------------------------------------------------
*/

likeButton.addEventListener("click", () => {
  if (!activeCard) {
    return;
  }

  swipe("right");
});

dislikeButton.addEventListener("click", () => {
  if (!activeCard) {
    return;
  }

  swipe("left");
});

/*
|--------------------------------------------------------------------------
| MATCH
|--------------------------------------------------------------------------
*/

function showMatch() {
  matchOverlay.classList.add("active");

  setTimeout(() => {
    matchOverlay.classList.add("message-visible");
  }, 1200);
}

/*
|--------------------------------------------------------------------------
| CONTINUE
|--------------------------------------------------------------------------
*/

continueButton.addEventListener("click", () => {
  matchOverlay.classList.remove("active");

  /*
   * После Match продолжаем
   * с 7-й девушки.
   */

  currentIndex++;

  renderCards();
});

/*
|--------------------------------------------------------------------------
| KEYBOARD
|--------------------------------------------------------------------------
*/

document.addEventListener("keydown", (event) => {
  if (matchOverlay.classList.contains("active")) {
    return;
  }

  if (event.key === "ArrowLeft") {
    swipe("left");
  }

  if (event.key === "ArrowRight") {
    swipe("right");
  }
});

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

renderCards();
/*
|--------------------------------------------------------------------------
| STARTUP SPLASH
|--------------------------------------------------------------------------
*/

const splashScreen = document.getElementById("splashScreen");
const splashHeartWrap = document.getElementById("splashHeartWrap");
const splashStart = document.getElementById("splashStart");

window.addEventListener("load", () => {
  /*
   * Небольшая пауза после появления логотипа.
   */

  setTimeout(() => {
    splashHeartWrap.classList.add("explode");
    splashStart.classList.add("show");
  }, 1050);

  /*
   * После "Начнём!" открываем приложение.
   */

  setTimeout(() => {
    splashScreen.classList.add("hide");
  }, 1900);
});
