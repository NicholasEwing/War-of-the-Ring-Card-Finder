// useful global funcs
function removeChildren(parentElement) {
  parentElement.innerHTML = "";
}

/* ---------------------------------------------------------------------
  * 
  * cardModule contains logic for rendering a selected card
  *
    --------------------------------------------------------------------- */
const cardModule = (function() {
  const cardDiv = document.getElementById("card");
  const flipBtn = document.getElementById("flip-btn");
  const typeIcon = document.getElementById("type-icon");

  const eventBox = document.getElementById("event-box");
  const eventTitle = document.getElementById("event-title");
  const eventPre = document.getElementById("precondition");
  const eventText = document.getElementById("event-text");
  const eventDiscard = document.getElementById("discard-condition");

  const combatBox = document.getElementById("combat-box");
  const combatTitle = document.getElementById("combat-title");
  const combatText = document.getElementById("combat-text");

  const initiativeNumber = document.getElementById("initiative-number");
  const cardNumber = document.getElementById("card-number");

  let listening = false;
  let listener;

  function createCard(card) {
    const settings = getFactionSettings(card);

    changeBg(settings);
    changeTypeIcon(settings);
    changeBoxSizes(card);
    replaceCardText(card);
    flipBtnReset(card);
  }

  function flipBtnReset(card) {
    // reset classes and bg image
    cardDiv.classList.remove("flip-left");
    cardDiv.classList.remove("flip-right");
    cardDiv.classList.remove("hide");
    cardDiv.style.backgroundImage = "";
    cardDiv.style.backgroundSize = "";

    // ensure flipBtn listener is using the correct card back
    if (!listening) {
      listening = true;

      listener = function() {
        flipCard(card);
      };

      flipBtn.addEventListener("click", listener);
    } else {
      // remove old card back
      flipBtn.removeEventListener("click", listener);

      // change listener func to use the new card
      listener = function() {
        flipCard(card);
      };

      // add new card back
      flipBtn.addEventListener("click", listener);
    }
  }

  function flipCard(card) {
    const flipped = !!cardDiv.classList.contains("flip-left");
    const hidden = !!cardDiv.classList.contains("hide");

    flipped ? showFront() : showBack();

    // Delay bg and text change to create a smoother flip animation
    setTimeout(function() {
      hidden ? revealCard() : hideCard(card);
    }, 150);
  }

  function showFront() {
    cardDiv.classList.remove("flip-left");
    cardDiv.classList.add("flip-right");
  }

  function showBack() {
    cardDiv.classList.remove("flip-right");
    cardDiv.classList.add("flip-left");
  }

  function hideCard(card) {
    cardDiv.classList.add("hide");
    cardDiv.style.backgroundImage = `url(/images/cardbacks/${card.faction}-${
      card.deckSource
    }-cardback.jpg)`;
  }

  function revealCard() {
    cardDiv.classList.remove("hide");
    cardDiv.style.backgroundImage = ``;
  }

  function getFactionSettings(card) {
    const fac = card.faction === "free-peoples" ? "fp" : "shadow";

    const settings = {};

    settings.bgClass = `${fac}-${card.cardSize}`;
    settings.imgClass = `type-icon-${fac}`;
    settings.iconSrc = `${fac}-${card.type}-icon.png`;

    return settings;
  }

  function changeBg(settings) {
    const oldClass = cardDiv.classList.item(1);
    const bgClass = settings.bgClass;
    if (oldClass) {
      cardDiv.classList.replace(oldClass, bgClass);
    } else {
      cardDiv.classList.add("card");
      cardDiv.classList.add(bgClass);
    }
  }

  function changeTypeIcon(settings) {
    const oldClass = typeIcon.classList.item(0);
    const imgClass = settings.imgClass;
    const iconSrc = settings.iconSrc;

    if (oldClass) {
      typeIcon.classList.replace(oldClass, imgClass);
    } else {
      typeIcon.classList.add(imgClass);
    }

    typeIcon.src = `/images/icons/${iconSrc}`;
    cardDiv.appendChild(typeIcon);
  }

  function changeBoxSizes(card) {
    const oldEvBoxClass = eventBox.classList.item(0);
    const oldComBoxClass = combatBox.classList.item(0);
    const newEvBoxClass = `event-box-${card.faction}`;
    const newComBoxClass = `combat-box-${card.faction}`;

    if (oldEvBoxClass && oldComBoxClass) {
      eventBox.classList.replace(oldEvBoxClass, newEvBoxClass);
      combatBox.classList.replace(oldComBoxClass, newComBoxClass);
    } else {
      eventBox.classList.add(newEvBoxClass);
      combatBox.classList.add(newComBoxClass);
    }

    const oldSize = combatBox.classList.item(1);
    if (oldSize) {
      combatBox.classList.replace(oldSize, `box-${card.cardSize}`);
    } else {
      combatBox.classList.add(`box-${card.cardSize}`);
    }
  }

  function replaceCardText(card) {
    eventTitle.innerHTML = card.eventTitle;
    eventPre.innerHTML = card.precondition;
    eventText.innerHTML = card.eventText;
    eventDiscard.innerHTML = card.discardCondition;
    combatTitle.innerHTML = card.combatTitle;
    combatText.innerHTML = card.combatText;
    initiativeNumber.innerHTML = card.initiativeNumber;
    cardNumber.innerHTML = card.cardNumber;
  }

  return {
    createCard: createCard
  };
})();

/* ---------------------------------------------------------------------
  * 
  * suggestionModule contains logic for creating the input dropdown
  *
    --------------------------------------------------------------------- */

const suggestionModule = (function() {
  const suggestions = document.getElementById("suggestions");
  const searchInput = document.getElementById("input");

  function randomPlaceholder() {
    const list = [
      "Nazgul",
      "Fellowship",
      "Aragorn",
      "Shadow Army",
      "Shadow",
      "Free Peoples",
      "Witch-King",
      "Isengard",
      "Rohan",
      "Hunt Tile",
      "Stronghold",
      "Will of the West",
      "Gandalf the White",
      "The Ents Awake",
      "At War",
      "Gondor",
      "Elves",
      "Gollum",
      "Fangorn",
      "Minas Tirith"
    ];

    random = Math.floor(Math.random() * list.length);
    searchInput.placeholder = list[random];
  }

  function displayMatches() {
    const value = searchInput.value.trim();
    // TODO: Check if fetch exists, if not, use XML instead! IE compatiability!
    if (typeof value !== "undefined") {
      const request = new XMLHttpRequest();
      request.responseType = "json";
      request.open("GET", "/?search=" + value);

      request.onload = function() {
        if (this.status === 200) {
          const matches = this.response;
          createItems(matches, value);
        } else if (this.status === 404) {
          console.log("Error occurred");
        }
      };

      request.onerror = function() {
        console.log("Something went wrong!");
      };

      request.send();
    }
  }

  function createItems(matches, value) {
    removeChildren(suggestions);

    if (matches === null) return;

    const regex = new RegExp(value, "gi");
    buildLis(matches, regex);

    const pages = Math.ceil(matches.length / 5);
    if (pages) {
      const nav = buildNav(matches, regex, pages);
      suggestions.appendChild(nav);
    }
  }

  function buildLis(matches, regex) {
    matches.forEach(function(card) {
      const items = suggestions.getElementsByTagName("A").length;
      if (items > 4) return;
      const li = document.createElement("li");
      buildText(li, regex, card);
      buildLink(li, card);
    });

    removeLeftovers(suggestions, matches);
  }

  function buildLink(li, card) {
    const a = document.createElement("a");

    a.href = "#";
    a.addEventListener("click", function() {
      removeChildren(suggestions);
      cardModule.createCard(card);
    });

    a.appendChild(li);
    suggestions.insertBefore(a, suggestions.childNodes[0]);
  }

  function buildText(li, regex, card) {
    const title = createTitle(regex, card.eventTitle);
    const pre = createTxt(regex, card.precondition, true);
    const txt = createTxt(regex, card.eventText);

    li.appendChild(title);
    card.precondition ? li.appendChild(pre) : false;
    li.appendChild(txt);
  }

  function createTitle(regex, str) {
    const h1 = document.createElement("h1");
    const titleHighlight = highlightMatches(regex, str);

    h1.classList.add("title");
    h1.innerHTML = titleHighlight;

    return h1;
  }

  function createTxt(regex, str, pre = false) {
    const endNum = pre ? 30 : 155;
    const txtClass = pre ? "pre" : "txt";
    const p = document.createElement("p");
    const subStr = str.substring(0, endNum) + "...";
    const highLight = highlightMatches(regex, subStr);

    p.classList.add(txtClass);
    p.innerHTML = highLight;

    return p;
  }

  function highlightMatches(regex, str) {
    const highlightedText = str.replace(regex, function(match) {
      return `<span class="highlight">${match}</span>`;
    });

    return highlightedText;
  }

  function removeLeftovers(suggestions, matches) {
    const diff = suggestions.getElementsByTagName("A").length - matches.length;
    if (diff <= 0) return;
    for (let i = 0; i < diff; i++) {
      const leftover = suggestions.lastChild.previousSibling;
      leftover.remove();
    }
  }

  function removeMatches() {
    const matches = suggestions.getElementsByTagName("A");
    const oldResults = [].slice.call(matches); // convert HTML collection to arr

    oldResults.forEach(function(result) {
      result.remove();
    });
  }

  function buildNav(res, regex, pages) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const left = document.createElement("span");
    const right = document.createElement("span");
    let currentPage = 1;

    left.innerHTML = "";
    right.innerHTML = `<i class="fas fa-arrow-circle-right xs"></i>`;
    left.id = "left";
    right.id = "right";

    left.addEventListener("click", function() {
      if (currentPage === 1) return;
      currentPage--;
      if (currentPage === 1) left.innerHTML = ""; // removes arrow when going from page 2 to page 1
      if (currentPage === pages - 1) {
        right.innerHTML = `<i class="fas fa-arrow-circle-right xs"></i>`;
      }
      movePage(res, currentPage, regex, p);
      updatePageTxt(p, currentPage, pages);
    });

    right.addEventListener("click", function() {
      if (currentPage === pages) return;
      currentPage++;
      if (currentPage > 0)
        left.innerHTML = `<i class="fas fa-arrow-circle-left xs"></i>`;
      if (currentPage === pages) right.innerHTML = "";

      movePage(res, currentPage, regex, p);
      updatePageTxt(p, currentPage, pages);
    });

    updatePageTxt(p, currentPage, pages);

    p.id = "pages";
    li.appendChild(left);
    li.appendChild(right);
    li.appendChild(p);

    return li;
  }

  function updatePageTxt(p, currentPage, pages) {
    p.innerHTML = `Page ${currentPage} out of ${pages}`;
  }

  function splitPages(res) {
    const pageArr = [];
    for (let i = 0; i < res.length; i += 5) {
      pageArr.push(res.slice(i, i + 5));
    }

    return pageArr;
  }

  function movePage(res, currentPage, regex, p) {
    removeMatches();
    const pageArr = splitPages(res);

    buildLis(pageArr[currentPage - 1], regex);
  }

  // Display matches when typing / focusing search bar, remove when clicking off.
  function addSearchListeners() {
    searchInput.addEventListener("keyup", function(event) {
      const k = event.keyCode; // ignore arrow keys
      if (k > 36 && k < 41) return;
      suggestionModule.displayMatches();
    });

    searchInput.addEventListener("focus", suggestionModule.displayMatches);

    document.addEventListener(
      "click",
      function() {
        if (
          !(event.target === searchInput || suggestions.contains(event.target))
        )
          removeChildren(suggestions);
      },
      true
    );
  }

  function addArrowKeyListeners() {
    document.addEventListener("keydown", function(event) {
      // down arrow
      if (event.keyCode === 40 && suggestions.children.length > 0) {
        event.preventDefault();
        const next = document.activeElement.nextSibling;
        if (next === null || next.nodeName === "#text") {
          suggestions.firstChild.focus();
        } else {
          next.focus();
        }
      }

      // up arrow
      if (event.keyCode === 38 && suggestions.children.length > 0) {
        event.preventDefault();
        const prev = document.activeElement.previousSibling;
        if (prev === null || prev.nodeName === "#text") return;
        prev.focus();
      }

      // left arrow (move page left)
      if (event.keyCode === 37) {
        event.preventDefault();
        const prevPageBtn = document.getElementById("left");
        prevPageBtn.click();
      }

      // right arrow (move page right)
      if (event.keyCode === 39) {
        event.preventDefault();
        const nextPageBtn = document.getElementById("right");
        nextPageBtn.click();
      }
    });
  }

  return {
    displayMatches: displayMatches,
    addSearchListeners: addSearchListeners,
    addArrowKeyListeners: addArrowKeyListeners,
    randomPlaceholder: randomPlaceholder
  };
})();

suggestionModule.addSearchListeners();
suggestionModule.addArrowKeyListeners();
// suggestionModule.randomPlaceholder();
