// ----------------------------------------------------------------------------
// Set up globals and event listeners
// ----------------------------------------------------------------------------

// TODO: get rid of globals

// listener logic for flip card
var listening = false;
_listener = function() {
	flipCard(card);
}

var suggestions = document.querySelector("#suggestions");
var searchInput = document.querySelector("input");

addSearchListeners();
addArrowKeyListeners();

// ---------------------------------------------------------------------------------
// createCard() handles logic to create a new card when a suggestion is selected 
// ---------------------------------------------------------------------------------

function createCard(card) {
	var elements = getCardElements();
	var settings = getFactionSettings(card, elements);

	flipBtnReset(card);
	removeChildren(elements.cardDiv);
	changeBg(settings, elements);
	changeTypeIcon(settings, elements);
	changeBoxSizes(settings, elements, card);
	addCardText(elements, card);
}

function flipBtnReset(card) {
	var cardDiv = document.querySelector(".card");
	var flipBtn = document.querySelector(".flip-btn");

	cardDiv.classList.remove("flip-left");
	cardDiv.classList.remove("flip-right");
	cardDiv.classList.remove("hide");
	cardDiv.style.backgroundImage = "";
	cardDiv.style.backgroundSize = "";

	// clean up event handlers, this is super sloppy
	// https://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters

	if(!listening) {
		listening = true;

		_listener = function() {
			flipCard(card);
		}

		flipBtn.addEventListener("click", _listener);
	} else {
		flipBtn.removeEventListener("click", _listener);

		_listener = function() {
			flipCard(card);
		}

		flipBtn.addEventListener("click", _listener);
	}
}

function removeChildren(parentElement) {
	while(parentElement.firstChild) {
		parentElement.removeChild(parentElement.firstChild);
	}
}

function getCardElements() {
	var elements = {};

	elements.cardDiv = document.querySelector(".card");
	elements.eventBox = document.createElement("div"); 
	elements.typeIcon = document.createElement("img");
	elements.combatBox = document.createElement("div");

	return elements
}

function getFactionSettings(card, elements) {
	var eventBox 	= elements.eventBox;
	var combatBox 	= elements.combatBox;
	
	var settings = {};

	if(card.faction === "free peoples") {
		settings.newClass 	= `fp-${card.cardSize}`;
		settings.imgClass 	= "type-icon-fp";
		settings.iconSrc	= `fp-${card.type}-Icon.png`;
		eventBox.classList.add("event-box-free-peoples");
		combatBox.classList.add("combat-box-free-peoples");
	} else {
		settings.newClass 	= `${card.faction}-${card.cardSize}`;
		settings.imgClass 	= `type-icon-${card.faction}`;
		settings.iconSrc 	= `${card.faction}-${card.type}-Icon.png`;
		eventBox.classList.add(`event-box-${card.faction}`);
		combatBox.classList.add(`combat-box-${card.faction}`);
	}

	return settings;
}

function changeBg(settings, elements) {
	var cardDiv = elements.cardDiv;
	var oldClass = cardDiv.classList.item(1);
	var newClass = settings.newClass;

	cardDiv.classList.replace(oldClass, newClass);
}

function changeTypeIcon(settings, elements) {
	var cardDiv = elements.cardDiv;
	var typeIcon = elements.typeIcon;
	var imgClass = settings.imgClass;
	var iconSrc = settings.iconSrc;

	typeIcon.classList.add(imgClass);
	typeIcon.src = `/images/icons/${iconSrc}`;
	cardDiv.appendChild(typeIcon);
}

function changeBoxSizes(settings, elements, card) {
	var cardDiv 	= elements.cardDiv;
	var eventBox 	= elements.eventBox;
	var combatBox 	= elements.combatBox;

	cardDiv.appendChild(eventBox);
	cardDiv.appendChild(combatBox);
	combatBox.classList.add(`box-${card.cardSize}`);
}

function addCardText(elements, card) {
	var cardDiv 	= elements.cardDiv;
	var eventBox 	= elements.eventBox;
	var combatBox 	= elements.combatBox;

	// add event section text
	appendTextToDiv("event-title", card.eventTitle, cardDiv);
	appendTextToDiv("event-text", card.eventText, eventBox);
	if(card.precondition) appendTextToDiv("precondition", card.precondition, eventBox);
	if(card.discardCondition) appendTextToDiv("discard-condition", card.discardCondition, eventBox);

	// add combat section text
	appendTextToDiv("combat-title", card.combatTitle, combatBox);
	appendTextToDiv("combat-text", card.combatText, combatBox);

	// add misc text
	appendTextToDiv("initiative-number", card.initiativeNumber, cardDiv);
	appendTextToDiv("card-number", card.cardNumber, cardDiv);
}

function appendTextToDiv(className, text, div) {
	if(className.includes("title")) {
		var tag = "h1";
	} else {
		var tag = "p";
	}

	var ele = document.createElement(tag);
	ele.classList.add(className);
	ele.innerText = text;
	div.appendChild(ele);
}

// ---------------------------------------------------------------------------------
// displayMatches() creates dropdown suggestions when searching for cards
// ---------------------------------------------------------------------------------

// TODO: Refactor displayMatches and the functions it calls

function displayMatches() {
	var value = searchInput.value.trim();
	if(typeof value !== "undefined") {
		var request = new XMLHttpRequest();
		request.responseType = "json";
		request.open("GET", "/?search=" + value);

		request.onload = function() {
			if(this.status === 200) {
				var res = this.response;
				createItems(res, value);
			} else if(this.status === 404) {
				console.log("Error occurred")
			}
		}

		request.onerror = function() {
			console.log("Something went wrong!");
		}

		request.send();
	}
}

function createItems(res, value) {
	removeChildren(suggestions);

	if(res !== null) {
		if(res.length > 4) {
			// count num of pages (results / 5)
			var pages = Math.ceil(res.length / 5);
		}

		var regex = new RegExp(value, "gi");

		buildLis(res, regex);

		if(pages) {
			var nav = buildNav(res, regex, pages);
			suggestions.appendChild(nav);
		}
	}
}

function buildLis(arr, regex, replace=false) {
	var oldResults = suggestions.getElementsByTagName("A");
	for (var i = 0; i < oldResults.length; i++) {
		oldResults[i].remove()
	}

	arr.forEach(function(card, i){
		if(suggestions.childElementCount > 4 && !replace) {
			return;
		}

		var a = document.createElement("a");
		a.href = "#";

		a.addEventListener("click", function(){
			removeChildren(suggestions);
			createCard(card);
		});

		// prevents arrow key nav and mouseover from
		// creating multiple hover effects
		a.addEventListener("mouseenter", function(){
			// TODO: maybe turn this off? kind off annoying
			// if mouse touches a suggestion while typing
			a.focus();
		})

		a.addEventListener("mouseleave", function(){
			a.blur();
		})

		var li = document.createElement("li");

		// create & highlight event title -------------------
		var title = createTitle(regex, card.eventTitle);
		li.appendChild(title);

		// create & highlight precondition text -------------------
		if(card.precondition) {
			var pre = createPre(regex, card.precondition);
			li.appendChild(pre);
		}

		// create & highlight event text -------------------
		var txt = createTxt(regex, card.eventText);
		li.appendChild(txt);

		a.appendChild(li);

		// add new lis to dropdown
		suggestions.insertBefore(a, suggestions.childNodes[0]);
	});

	// handle leftovers when changing pages, might need to rework a lot of stuff
	// wrap your head around why this fixes suggestions from stacking!
	if(replace) {
		var diff = (suggestions.getElementsByTagName("A").length - arr.length);
		for (var i = 0; i < diff; i++) {
			var leftover = suggestions.lastChild.previousSibling;
			leftover.remove();
		}
	}
}

function buildNav(res, regex, pages) {
	// create pages with 5 cards on each
	var pageArr = [];
	for(var i = 0; i < res.length; i+=5) {
		pageArr.push(res.slice(i, i+5));
	}

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
	left.addEventListener("click", function(){
		if(currentPage === 0) {
			return;
		}

		if(currentPage <= pages-1) {
			right.innerHTML = ">";
		}

		currentPage--;

		if(currentPage === 0) {
			left.innerHTML = "";
		}

		p.innerHTML = "Page " + (currentPage+1) +  " out of " + pages;
		moveLeft(pageArr, currentPage, regex);
	});

	right.addEventListener("click", function(){
		if(currentPage === pages-1) {
			return;
		}

		currentPage++;

		p.innerHTML = "Page " + (currentPage+1) +  " out of " + pages;

		if(currentPage > 0) {
			left.innerHTML = "<";
		}

		if(currentPage === pages-1) {
			right.innerHTML = "";
		}

		moveRight(pageArr, currentPage, regex);
	});

	p.classList.add("pages");
	p.innerHTML = "Page " + (currentPage+1) +  " out of " + pages;
	li.appendChild(left);
	li.appendChild(right);
	li.appendChild(p);
	return li;
}

function moveLeft(pageArr, page, regex) {
	buildLis(pageArr[page], regex, true);
}

function moveRight(pageArr, page, regex) {
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

function highlightMatches(regex, str){
	var highlightedText =  str.replace(regex, function(match) {
		return `<span class="highlight">${match}</span>`;
	});

	return highlightedText;
}
// ----------------------------------------------------------------------------
// Card flip functions
// ----------------------------------------------------------------------------

function flipCard(card){
	var cardDiv = document.querySelector(".card");

	// would use destructing here but it isn't supported on
	// IE or Safari, might use Babel later to do that and
	// use arrow functions
	var deckSource = card.deckSource;
	var faction = card.faction;

	var deckUrlStr = deckSource.replace(/ .*/,'');

	if(faction === "free peoples") {
		var factionUrlStr = "FP";
	} else {
		var factionUrlStr = "Shadow";
	}

	// if not flipped, flip the card
	if(!cardDiv.classList.contains("flip-left")) {
		cardDiv.classList.remove("flip-right");
		cardDiv.classList.add("flip-left");
	} else {
		// if card is flipped, flip it back over
		cardDiv.classList.remove("flip-left");
		cardDiv.classList.add("flip-right");
	}

	setTimeout(function(){
		// if card content isn't hidden, hide it
		if(!cardDiv.classList.contains("hide")) {
			cardDiv.classList.add("hide");
			cardDiv.style.backgroundImage = `url(/images/cardbacks/${factionUrlStr}-${deckUrlStr}-Cardback.jpg)`;
		} else {
			// if card content is hidden, reveal it
			cardDiv.classList.remove("hide");
			cardDiv.style.backgroundImage = ``;
		}
	}, 150);
}


// ----------------------------------------------------------------------------
// Event Listener Functions
// ----------------------------------------------------------------------------

// Display matches when typing / focusing search bar, remove when clicking off.
function addSearchListeners() {
	var searchInput = document.querySelector("input");

	searchInput.addEventListener("keyup", function(event){
		var k = event.keyCode; // ignore arrow keys
		if(k === 40 || k === 39 || k === 38 || k === 37) {
			return;
		}
		displayMatches();
	});

	searchInput.addEventListener("focus", displayMatches);

	document.addEventListener("click", function(){
		if(!(event.target === searchInput || suggestions.contains(event.target))) {
			removeChildren(suggestions);
		}
	});
}

// Arrow key nav on suggestions
function addArrowKeyListeners() {
	document.addEventListener("keydown", function(event){
		// down arrow
		if(event.keyCode === 40 && suggestions.children.length > 0) {
			event.preventDefault();
			var next = document.activeElement.nextSibling;
			if(next === null || next.nodeName === "#text") {
				suggestions.firstChild.focus();
			} else {
				next.focus();
			}
		}

		// up arrow
		if(event.keyCode === 38 && suggestions.children.length > 0) {
			event.preventDefault();
			var prev = document.activeElement.previousSibling;
			if(prev === null || prev.nodeName === "#text") {
				return;
			} else {
				prev.focus();
			}
		}

		// left arrow (move page left)
		if(event.keyCode === 37) {
			event.preventDefault();
			var prevPageBtn = document.querySelector(".left");
			prevPageBtn.click();
		}

		// right arrow (move page right)
		if(event.keyCode === 39) {
			event.preventDefault();
			var nextPageBtn = document.querySelector(".right");
			nextPageBtn.click();
		}
	});
}