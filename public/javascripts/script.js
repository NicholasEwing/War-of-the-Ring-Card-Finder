// ----------------------------------------------------------------------------
// Set up globals and event listeners
// ----------------------------------------------------------------------------

// TODO: get rid of globals

// TODO: Normalize the 'free peoples' naming scheme with files and in DB

// TODO optimization:
//   replace vars with const / let
//   replace queryselectors with getElements
//   find areas where functions can be short circuited faster!

// listener logic for flip card
let suggestions = document.querySelector("#suggestions");
let searchInput = document.querySelector("input");

// this is still global jsut figure out something idk
function removeChildren(parentElement) {
  parentElement.innerHTML = "";
}

// card module
const cardModule = (function() {
  // vars--------------------------
  var cardDiv = document.querySelector(".card");
  var flipBtn = document.querySelector(".flip-btn");
  var typeIcon = document.querySelector(".type-icon");

  var eventBox = document.querySelector(".event-box");
  var eventTitle = document.querySelector(".event-title");
  var eventPre = document.querySelector(".precondition");
  var eventText = document.querySelector(".event-text");
  var eventDiscard = document.querySelector(".discard-condition");

  var combatBox = document.querySelector(".combat-box");
  var combatTitle = document.querySelector(".combat-title");
  var combatText = document.querySelector(".combat-text");

  var initiativeNumber = document.querySelector(".initiative-number");
  var cardNumber = document.querySelector(".card-number");

  let listening = false;
  let listener;

  // functions----------------------
  function createCard(card) {
    var settings = getFactionSettings(card);

    flipBtnReset(card);
    changeBg(settings);
    changeTypeIcon(settings);
    changeBoxSizes(card.cardSize);
    replaceCardText(card);
  }

  function flipBtnReset(card) {
    cardDiv.classList.remove("flip-left");
    cardDiv.classList.remove("flip-right");
    cardDiv.classList.remove("hide");
    cardDiv.style.backgroundImage = "";
    cardDiv.style.backgroundSize = "";

    if (!listening) {
      listening = true;

      listener = function() {
        flipCard(card);
      };

      flipBtn.addEventListener("click", listener);
    } else {
      flipBtn.removeEventListener("click", listener);

      // change listener to use the new card
      listener = function() {
        flipCard(card);
      };

      flipBtn.addEventListener("click", listener);
    }
  }

  function flipCard(card) {
    var deckSource = card.deckSource;
    var faction = card.faction;

    if (faction === "free peoples") {
      var factionUrlStr = "free-peoples";
    } else {
      var factionUrlStr = "Shadow";
    }

    // if not flipped, flip the card
    if (!cardDiv.classList.contains("flip-left")) {
      cardDiv.classList.remove("flip-right");
      cardDiv.classList.add("flip-left");
    } else {
      // if card is flipped, flip it back over
      cardDiv.classList.remove("flip-left");
      cardDiv.classList.add("flip-right");
    }

    setTimeout(function() {
      // if card content isn't hidden, hide it
      if (!cardDiv.classList.contains("hide")) {
        cardDiv.classList.add("hide");
        cardDiv.style.backgroundImage = `url(/images/cardbacks/${factionUrlStr}-${deckSource}-Cardback.jpg)`;
      } else {
        // if card content is hidden, reveal it
        cardDiv.classList.remove("hide");
        cardDiv.style.backgroundImage = ``;
      }
    }, 150);
  }

  function getFactionSettings(card) {
    var settings = {};
    var oldEvBoxClass = eventBox.classList.item(0);
    var oldComBoxClass = combatBox.classList.item(0);

    if (card.faction === "free peoples") {
      settings.newClass = `fp-${card.cardSize}`;
      settings.imgClass = "type-icon-fp";
      settings.iconSrc = `fp-${card.type}-Icon.png`;
      eventBox.classList.replace(oldEvBoxClass, "event-box-free-peoples");
      combatBox.classList.replace(oldComBoxClass, "combat-box-free-peoples");
    } else {
      settings.newClass = `${card.faction}-${card.cardSize}`;
      settings.imgClass = `type-icon-${card.faction}`;
      settings.iconSrc = `${card.faction}-${card.type}-Icon.png`;
      eventBox.classList.replace(oldEvBoxClass, `event-box-${card.faction}`);
      combatBox.classList.replace(oldComBoxClass, `combat-box-${card.faction}`);
    }

    return settings;
  }

  function changeBg(settings) {
    var oldClass = cardDiv.classList.item(1);
    var newClass = settings.newClass;
    cardDiv.classList.replace(oldClass, newClass);
  }

  function changeTypeIcon(settings) {
    var imgClass = settings.imgClass;
    var iconSrc = settings.iconSrc;

    var oldClass = typeIcon.classList.item(0);
    typeIcon.classList.replace(oldClass, imgClass);
    typeIcon.src = `/images/icons/${iconSrc}`;
    cardDiv.appendChild(typeIcon);
  }

  function changeBoxSizes(cardSize) {
    var oldSize = combatBox.classList.item(1);
    if (oldSize) {
      combatBox.classList.replace(oldSize, `box-${cardSize}`);
    } else {
      combatBox.classList.add(`box-${cardSize}`);
    }
  }

  function replaceCardText(card) {
    eventTitle.innerText = card.eventTitle;
    eventPre.innerText = card.precondition;
    eventText.innerText = card.eventText;
    eventDiscard.innerText = card.discardCondition;
    combatTitle.innerText = card.combatTitle;
    combatText.innerText = card.combatText;
    initiativeNumber.innerText = card.initiativeNumber;
    cardNumber.innerText = card.cardNumber;
  }

  // only expose what is needed!
  return {
    createCard: createCard
  };
})();

// ---------------------------------------------------------------------------------
// displayMatches() creates dropdown suggestions when searching for cards
// ---------------------------------------------------------------------------------

// TODO: create a suggestionsModule and stick everything relevant in it

function displayMatches() {
  var value = searchInput.value.trim();
  // TODO: Check if fetch exists, if not, use XML instead! IE compatiability!
  if (typeof value !== "undefined") {
    var request = new XMLHttpRequest();
    request.responseType = "json";
    request.open("GET", "/?search=" + value);

    request.onload = function() {
      if (this.status === 200) {
        var matches = this.response;
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

  if (matches !== null) {
    if (matches.length > 4) {
      var pages = Math.ceil(matches.length / 5);
    }

    var regex = new RegExp(value, "gi");

    buildLis(matches, regex);

    if (pages) {
      var nav = buildNav(matches, regex, pages);
      suggestions.appendChild(nav);
    }
  }
}

function buildLis(matches, regex, replace = false) {
  var suggestions = document.querySelector("#suggestions");

  matches.forEach(function(card, i) {
    if (suggestions.childElementCount > 4 && !replace) {
      return;
    }

    var li = document.createElement("li");
    var a = buildLink(card);
    a.appendChild(li);

    buildText(card, regex, li);
    suggestions.insertBefore(a, suggestions.childNodes[0]);
  });

  if (replace) {
    removeLeftovers(suggestions, matches);
  }
}

function buildLink(card) {
  var a = document.createElement("a");
  a.href = "#";

  a.addEventListener("click", function() {
    removeChildren(suggestions);
    cardModule.createCard(card);
  });

  a.addEventListener("mouseenter", function() {
    a.focus();
  });

  a.addEventListener("mouseleave", function() {
    a.blur();
  });

  return a;
}

function buildText(card, regex, li) {
  var title = createTitle(regex, card.eventTitle);
  li.appendChild(title);

  if (card.precondition) {
    var pre = createPre(regex, card.precondition);
    li.appendChild(pre);
  }

  var txt = createTxt(regex, card.eventText);
  li.appendChild(txt);
}

function removeLeftovers(suggestions, matches) {
  var diff = suggestions.getElementsByTagName("A").length - matches.length;
  for (var i = 0; i < diff; i++) {
    var leftover = suggestions.lastChild.previousSibling;
    leftover.remove();
  }
}

function removeMatches(element) {
  var oldResults = suggestions.getElementsByTagName("A");

  for (var i = 0; i < oldResults.length; i++) {
    oldResults[i].remove();
  }
}

function buildNav(res, regex, pages) {
  var pageArr = splitPages(res);

  // change var name here? currentPage is weird because I have to subtract it and it doesn't line up with pages
  var currentPage = 0;
  var li = document.createElement("li");
  var p = document.createElement("p");

  var left = document.createElement("span");
  left.innerHTML = "";

  var right = document.createElement("span");
  right.innerHTML = ">";

  left.classList.add("left");
  right.classList.add("right");

  // creates listeners for left / right buttons
  left.addEventListener("click", function() {
    if (currentPage === 0) {
      return;
    }

    if (currentPage <= pages - 1) {
      right.innerHTML = ">";
    }

    currentPage--;

    if (currentPage === 0) {
      left.innerHTML = "";
    }

    p.innerHTML = "Page " + (currentPage + 1) + " out of " + pages;
    moveLeft(pageArr, currentPage, regex);
  });

  right.addEventListener("click", function() {
    if (currentPage === pages - 1) {
      return;
    }

    currentPage++;

    p.innerHTML = "Page " + (currentPage + 1) + " out of " + pages;

    if (currentPage > 0) {
      left.innerHTML = "<";
    }

    if (currentPage === pages - 1) {
      right.innerHTML = "";
    }

    moveRight(pageArr, currentPage, regex);
  });

  p.classList.add("pages");
  p.innerHTML = "Page " + (currentPage + 1) + " out of " + pages;
  li.appendChild(left);
  li.appendChild(right);
  li.appendChild(p);
  return li;
}

function splitPages(res) {
  var pageArr = [];
  for (var i = 0; i < res.length; i += 5) {
    pageArr.push(res.slice(i, i + 5));
  }

  return pageArr;
}

function moveLeft(pageArr, page, regex) {
  removeMatches(suggestions);
  buildLis(pageArr[page], regex, true);
}

function moveRight(pageArr, page, regex) {
  removeMatches(suggestions);
  buildLis(pageArr[page], regex, true);
}

function createTitle(regex, str) {
  var h1 = document.createElement("h1");
  h1.classList.add("title");

  var titleHighlight = highlightMatches(regex, str);
  h1.innerHTML = titleHighlight;

  return h1;
}

function createPre(regex, str) {
  var p = document.createElement("p");
  p.classList.add("pre");

  var preSub = str.substring(0, 30) + "...";
  var preHighlight = highlightMatches(regex, preSub);
  p.innerHTML = preHighlight;

  return p;
}

function createTxt(regex, str) {
  var p = document.createElement("p");
  p.classList.add("txt");

  var textSub = str.substring(0, 155) + "...";
  var txtHighlight = highlightMatches(regex, textSub);
  p.innerHTML = txtHighlight;

  return p;
}

function highlightMatches(regex, str) {
  var highlightedText = str.replace(regex, function(match) {
    return `<span class="highlight">${match}</span>`;
  });

  return highlightedText;
}

// ----------------------------------------------------------------------------
// Event Listener Functions
// ----------------------------------------------------------------------------

// Display matches when typing / focusing search bar, remove when clicking off.
(function addSearchListeners() {
  var searchInput = document.querySelector("input");

  searchInput.addEventListener("keyup", function(event) {
    var k = event.keyCode; // ignore arrow keys
    if (k === 40 || k === 39 || k === 38 || k === 37) {
      return;
    }
    displayMatches();
  });

  searchInput.addEventListener("focus", displayMatches);

  document.addEventListener("click", function() {
    if (!(event.target === searchInput || suggestions.contains(event.target))) {
      removeChildren(suggestions);
    }
  });
})();

(function addArrowKeyListeners() {
  document.addEventListener("keydown", function(event) {
    // down arrow
    if (event.keyCode === 40 && suggestions.children.length > 0) {
      event.preventDefault();
      var next = document.activeElement.nextSibling;
      if (next === null || next.nodeName === "#text") {
        suggestions.firstChild.focus();
      } else {
        next.focus();
      }
    }

    // up arrow
    if (event.keyCode === 38 && suggestions.children.length > 0) {
      event.preventDefault();
      var prev = document.activeElement.previousSibling;
      if (prev === null || prev.nodeName === "#text") {
        return;
      } else {
        prev.focus();
      }
    }

    // left arrow (move page left)
    if (event.keyCode === 37) {
      event.preventDefault();
      var prevPageBtn = document.querySelector(".left");
      prevPageBtn.click();
    }

    // right arrow (move page right)
    if (event.keyCode === 39) {
      event.preventDefault();
      var nextPageBtn = document.querySelector(".right");
      nextPageBtn.click();
    }
  });
})();
