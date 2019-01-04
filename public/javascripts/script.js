function buildLis(arr, regex, replace=false) {
	arr.forEach(function(card, i){
		if(suggestions.childElementCount > 4 && !replace) {
			return;
		}

		var li = document.createElement("li");
		li.tabIndex = 0;

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

		// add new lis to dropdown
		if(replace) {
			suggestions.replaceChild(li, suggestions.children[i]);
		} else {
			suggestions.appendChild(li);
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
		currentPage--;
		p.innerHTML = "Page " + (currentPage+1) +  " out of " + pages;
		moveLeft(pageArr, currentPage, regex);
	});

	right.addEventListener("click", function(){
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

function deleteItems() {
	while(suggestions.firstChild) {
		suggestions.removeChild(suggestions.firstChild);
	}
}

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
	if(typeof this.value !== "undefined") {
		var value = this.value.trim();
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

var searchInput = document.querySelector("input");
var suggestions = document.querySelector("#suggestions");

// display matches when user types in the search bar
searchInput.addEventListener("keyup", displayMatches);

// display matches when user focuses on search bar
searchInput.addEventListener("focus", displayMatches);

// delete matches when user clicks off search bar or suggestions
document.addEventListener("click", function(){
	if(!(event.target === searchInput || suggestions.contains(event.target))) {
		deleteItems();
	}
});

// TODO:
//	1. enable suggestions to be navigated with arrow key
// 	2. highlight relevant text
// 		2a. expand this to include more than just event title & event text
// 		2b. search entire card for relevant text, display snippet
//	3. make selecting a suggestion (click or enter) render the card