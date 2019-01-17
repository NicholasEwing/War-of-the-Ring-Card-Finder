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
    cardDiv.classList.remove("flip-right", "hide", "flip-left");
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
          const regex = new RegExp(value, "gi");
          const isDropdown = !!suggestions.children.length;

          // if no matches, remove suggestions
          if (!matches) {
            removeChildren(suggestions);
            return;
          }

          const pageArr = splitPages(matches, regex); // breaks all matches into "pages", 5 matches per page

          if (isDropdown) {
            // replace dropdown with new matches, update nav bar
            updateDropdown(pageArr, regex);
          } else {
            // if no dropdown, make one
            createDropdown(pageArr[0], regex, pageArr.length); //TODO: Enable page navigation again
          }
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

  //TODO: Major refactor - replace lis instead of deleting

  // createDropdown------------------------------------------
  //    takes first 5 or fewer matches, makes elements, and fills them in
  function createDropdown(firstPage, regex, numOfPages) {
    const elements = createElements();

    if (firstPage.length !== 5) {
      const diff = elements.length - firstPage.length;

      // hide unused elements starting from the bottom
      for (let i = diff; i > 0; i--) {
        elements[i].children[0].style.display = "none";
      }
    }

    fillElements(firstPage, elements, regex);

    // if more than 1 page of matches - add a nav bar
    if (numOfPages > 1) suggestions.appendChild(createNav(numOfPages));
  }

  function createElements() {
    const arr = [];

    // create 5 a tags containing lis
    for (let i = 0; i < 5; i++) {
      const a = document.createElement("a");
      const li = document.createElement("li");

      // make static li stuff
      const title = document.createElement("h1");
      const pre = document.createElement("p");
      const text = document.createElement("p");

      title.id = "title";
      pre.id = "pre";
      text.id = "text";

      li.appendChild(title);
      li.appendChild(pre);
      li.appendChild(text);

      a.href = "#";
      a.appendChild(li);

      arr.push(a);
      // add to dropdown
      suggestions.appendChild(a);
    }

    return arr;
  }

  function fillElements(firstPage, elements, regex) {
    firstPage.forEach(function(card, i) {
      const parentItem = elements[i];

      parentItem.addEventListener("click", function() {
        removeChildren(suggestions);
        cardModule.createCard(card);
      });

      // get li elements
      const li = parentItem.children[0];
      const titleEle = li.children[0];
      const preconditionEle = li.children[1];
      const eventTextEle = li.children[2];

      // check for precondition text
      const hasPre = !!card.precondition;

      // format text
      const title = card.eventTitle;
      const pre = hasPre ? card.precondition.substring(0, 30) + "..." : "";
      const eventText = card.eventText.substring(0, 155) + "...";

      // insert text to li
      titleEle.innerHTML = highlightMatches(regex, title);
      preconditionEle.innerHTML = highlightMatches(regex, pre);
      eventTextEle.innerHTML = highlightMatches(regex, eventText);
    });
  }

  function createNav(numOfPages) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const left = document.createElement("span");
    const right = document.createElement("span");
    let currentPage = 1;

    left.innerHTML = "";
    right.innerHTML = ">";
    left.id = "left";
    right.id = "right";

    left.addEventListener("click", function() {
      if (currentPage === 1) return;
      currentPage--;
      if (currentPage === 1) left.innerHTML = ""; // removes arrow when going from page 2 to page 1
      if (currentPage === pages - 1) right.innerHTML = ">";

      // need to make sure these functions below use the 1) updateDropdown function with the next page, depending on what current page is
      // movePage(res, currentPage, regex, p);
      // updatePageTxt(p, currentPage, pages);
    });

    right.addEventListener("click", function() {
      if (currentPage === pages) return;
      currentPage++;
      if (currentPage > 0) left.innerHTML = "<";
      if (currentPage === pages) right.innerHTML = "";

      // movePage(res, currentPage, regex, p);
      // updatePageTxt(p, currentPage, pages);
    });

    p.innerHTML = `Page ${currentPage} out of ${numOfPages}`;
    // updatePageTxt(p, currentPage, pages);

    p.id = "pages";
    li.appendChild(left);
    li.appendChild(right);
    li.appendChild(p);
    return li;
  }

  // ---------------------------------------------------------
  // updateDropdown ------------------------------------------

  // only triggers when dropdown items exist, such as new queries or moving pages
  function updateDropdown(newPage) {
    const items = suggestions.getElementsByTagName("A");
    console.log();

    if (newPage.length > items.length) {
      const diff = newPage.length - items.length; // need to reveal
      // if more matches than lis, reveal some
    }
    // if fewer matches than lis, hide some
    // same amount of matches and lis, don't do shit just replace

    console.log(newPage);
    console.log(newPage.length);
    // if nextPage and number of dropdown items are different
    //  if too many items, hide some
    //  if insufficient items, reveal some

    // takes next 5 (or less) matches and replaces txt
    // nextPage.forEach(function() {
    //   // GET all relevant elements
    //   const parentItem = true;

    //   const li = true;
    //   const titleEle = true;
    //   const preconditionEle = true;
    //   const eventTextEle = true;
    // });

    // update nav bar
  }

  // ---------------------------------------------------------

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
    right.innerHTML = ">";
    left.id = "left";
    right.id = "right";

    left.addEventListener("click", function() {
      if (currentPage === 1) return;
      currentPage--;
      if (currentPage === 1) left.innerHTML = ""; // removes arrow when going from page 2 to page 1
      if (currentPage === pages - 1) right.innerHTML = ">";

      movePage(res, currentPage, regex, p);
      updatePageTxt(p, currentPage, pages);
    });

    right.addEventListener("click", function() {
      if (currentPage === pages) return;
      currentPage++;
      if (currentPage > 0) left.innerHTML = "<";
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

    document.addEventListener("click", function() {
      if (!(event.target === searchInput || suggestions.contains(event.target)))
        removeChildren(suggestions);
    });
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
    createDropdown: createDropdown
  };
})();

suggestionModule.addSearchListeners();
suggestionModule.addArrowKeyListeners();
