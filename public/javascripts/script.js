// TODO: Ensure nav bar doesn't highlight on hover
// and that nav bar is not selectable by tab

// TODO:
//	1. enable suggestions to be navigated with arrow key
// 	2. highlight relevant text
// 		2a. expand this to include more than just event title & event text
// 		2b. search entire card for relevant text, display snippet
//	3. make selecting a suggestion (click or enter) render the card

function displayCard(card) {
	// TODO: DRY the heck out of this code

	var cardDiv = document.querySelector(".card");

	// TODO: modify and reuse the "deleteItems" function with an argument for parentNode
	// delete current card
	while(cardDiv.firstChild) {
		cardDiv.removeChild(cardDiv.firstChild);
	}

	// change card bg
	// div: change faction class, change cardSize class "ex: *shadow*-*4*"
	var oldClass = cardDiv.classList.item(1);
	if(card.faction === "free peoples") {
		var fp = card.faction.replace(" ", "-")
		var newClass = fp + "-" + card.cardSize;
	} else {
		var newClass = `${card.faction}-${card.cardSize}`;
	}
	cardDiv.classList.replace(oldClass, newClass);

	// add card type icon
	if(card.faction === "free peoples") {
		var iconSrc = `FP-${card.type}-Icon.png`;
	} else {
		var iconSrc = `${card.faction}-${card.type}-Icon.png`
	}
	var typeIcon = document.createElement("img");
	typeIcon.classList.add("type-icon");
	typeIcon.src = `/images/icons/${iconSrc}`;
	cardDiv.appendChild(typeIcon);

	// h1: change event title innerText
	var eventTitle = document.createElement("h1");
	eventTitle.classList.add("event-title");
	eventTitle.innerText = card.eventTitle;
	cardDiv.appendChild(eventTitle);

	// EVENT SECTION --------------------------------

	// div event-box:, change class faction "ex: event-box-*shadow*"
	var eventBox = document.createElement("div");
	if(card.faction === "free peoples") {
		eventBox.classList.add(`event-box-${fp}`);
	} else {
		eventBox.classList.add(`event-box-${card.faction}`);
	}
	cardDiv.appendChild(eventBox);

	// if card precondition
	if(card.precondition) {
		// create p tag with class "event-precondition"
		var precondition = document.createElement("p");
		precondition.classList.add("event-precondition");
		// add innerText
		precondition.innerText = card.precondition;
		
		eventBox.appendChild(precondition);
	}


	// p: change event-text innerText
	var eventText = document.createElement("p");
	eventText.classList.add("event-text");
	eventText.innerHTML = card.eventText;

	eventBox.appendChild(eventText);

	// if card has discardCondition
	if(card.discardCondition) {
		// create p tag with class "discard-condition"
		var discardCondition = document.createElement("p");
		discardCondition.classList.add("discard-condition");
		// add innerText
		discardCondition.innerText = card.discardCondition;
		
		eventBox.appendChild(discardCondition);
	}

	// COMBAT SECTION --------------------------------

	// div: change class faction and cardsize "ex: combat-box-*shadow* box-*4*"
	var combatBox = document.createElement("div");
	if(card.faction === "free peoples") {
		combatBox.classList.add(`combat-box-${fp}`);
	} else {
		combatBox.classList.add(`combat-box-${card.faction}`);
	}
	combatBox.classList.add(`box-${card.cardSize}`);
	cardDiv.appendChild(combatBox);

	// h1: change combat title
	var combatTitle = document.createElement("h1");
	combatTitle.classList.add("combat-title");
	combatTitle.innerText = card.combatTitle;

	combatBox.appendChild(combatTitle);

	// p: change combat text
	var combatText = document.createElement("p");
	combatText.classList.add("combat-text");
	combatText.innerText = card.combatText;

	combatBox.appendChild(combatText);

	// BOTTOM TEXT -----------------------------------

	// p: change initative number
	var initiativeNumber = document.createElement("p");
	initiativeNumber.classList.add("initiative-number");
	initiativeNumber.innerText = card.initiativeNumber;

	cardDiv.appendChild(initiativeNumber);

	// p: change card number
	var cardNumber = document.createElement("p");
	cardNumber.classList.add("card-number");
	cardNumber.innerText = card.cardNumber;

	cardDiv.appendChild(cardNumber);
}

function deleteItems() {
	while(suggestions.firstChild) {
		suggestions.removeChild(suggestions.firstChild);
	}
}

// -------- Functions used to create suggestion dropdown --------

function highlightMatches(regex, str){
	var highlightedText =  str.replace(regex, function(match) {
		return `<span class="highlight">${match}</span>`;
	});

	return highlightedText;
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

function createItems(res, value) {
	deleteItems();

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

function buildLis(arr, regex, replace=false) {
	arr.forEach(function(card, i){
		if(suggestions.childElementCount > 4 && !replace) {
			return;
		}

		var a = document.createElement("a");
		a.href = "#";

		a.addEventListener("click", function(){
			deleteItems();
			displayCard(card);
		});

		// prevents arrow key nav and mouseover from
		// creating multiple hover effects
		a.addEventListener("mouseenter", function(){
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

		// create & highlight discard condition text -------------------

		// create & highlight event text -------------------
		var txt = createTxt(regex, card.eventText);
		li.appendChild(txt);

		a.appendChild(li);

		// add new lis to dropdown
		if(replace) {
			suggestions.replaceChild(a, suggestions.children[i]);
		} else {
			suggestions.appendChild(a);
		}
	});
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

// --------------------------------------------------

var searchInput = document.querySelector("input");
var suggestions = document.querySelector("#suggestions");

// display matches when user types in the search bar
searchInput.addEventListener("keyup", function(event){
	if(event.keyCode === 40 || event.keyCode === 39 || event.keyCode === 38 || event.keyCode === 37) {
		return;
	}
	displayMatches();
});

// display matches when user focuses on search bar
searchInput.addEventListener("focus", displayMatches);

// delete matches when user clicks off search bar or suggestions
document.addEventListener("click", function(){
	if(!(event.target === searchInput || suggestions.contains(event.target))) {
		deleteItems();
	}
});

// allows up and down arrow key navigation on suggestions
document.addEventListener("keydown", function(event){

	if(event.keyCode === 40 && suggestions.children.length > 0) {
		event.preventDefault();
		var next = document.activeElement.nextSibling;
		if(next === null || next.nodeName === "#text") {
			suggestions.firstChild.focus();
		} else {
			next.focus();
		}
	}

	// up arrow navigation
	if(event.keyCode === 38 && suggestions.children.length > 0) {
		event.preventDefault();
		var prev = document.activeElement.previousSibling;
		if(prev === null || prev.nodeName === "#text") {
			return;
		} else {
			prev.focus();
		}
	}

	// left arrow navigation (move page left)
	if(event.keyCode === 37) {
		event.preventDefault();
		var prevPageBtn = document.querySelector(".left");
		prevPageBtn.click();
	}

	// right arrow navigation (move page right)
	if(event.keyCode === 39) {
		event.preventDefault();
		var nextPageBtn = document.querySelector(".right");
		nextPageBtn.click();
	}
});