function createItem(num) {
	deleteItems();

	if(num !== null) {
		num.forEach(function(card) {
			var li = document.createElement("li");
			li.tabIndex = 0;

			// event title
			var h1 = document.createElement("h1");
			h1.innerHTML = card.eventTitle;

			// event text
			var p = document.createElement("p");
			p.innerHTML = card.eventText.substring(0, 155) + "...";

			// add title & text to li
			li.appendChild(h1);
			li.appendChild(p);
			suggestions.appendChild(li);
		})	
	}
}

function deleteItems() {
	while(suggestions.firstChild) {
		suggestions.removeChild(suggestions.firstChild);
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
				// add styled li using response data to create card previews
				createItem(res);
				// move card render logic to client side
					// render card when its li is selected
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
//	3. make selecting a suggestion (click or enter) render the card