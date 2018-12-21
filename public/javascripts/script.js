function displayMatches() {
	console.log(this.value);
	var value = this.value.trim();
	var request = new XMLHttpRequest();
	request.responseType = "json";
	request.open("GET", "/?search=" + value);

	request.onload = function() {
		if(this.status === 200) {
			var res = this.response;
			console.log(res);
			console.log(type);
		} else if(this.status === 404) {
			console.log("Error occurred")
		}
	}

	request.onerror = function() {
		console.log("Something went wrong!");
	}

	request.send();

}

var searchInput = document.querySelector("input");
searchInput.addEventListener("keyup", displayMatches);