# War of The Ring - Event Card Finder

In this project, I've created a web application where you can search and find event cards from the popular War of the Ring (2nd Edition) board game.

Technologies used:
* HTML5
* CSS3
* JavaScript
* Node.js
* Express / EJS
* MongoDB / Mongoose
* Heroku

TODO:
* __Initial setup__
	* ~~Put in sample cards~~
	* ~~Create JSON file with mongoexport for seeding db later~~
	* ~~change card creation form to allow images for hunt tiles~~
	* ~~change card schema to include optional hunt tile image~~
	* ~~add "improved card text" to schema~~
	* ~~split creation form into separate route~~
* __Assets__
	* ~~create all image assets for card background (shadow / fp)~~
	* ~~turns out there are 4 card size variants per faction, turn these into image assets as well~~
	* create FP character icon
	* create Special Hunt Tile icons
* __CSS__
	* ~~create basic CSS styling for cards~~
	* ~~figure out proper CSS styling & spacing for card text - each card size has its own styling rules~~
		* ~~Event title~~
		* ~~Event precondition~~
		* ~~Event text~~
		* ~~Event discard condition~~
		* ~~Combat title~~
		* ~~Combat precondition~~
		* ~~Combat text~~
		* ~~Combat discard condition~~
		* ~~Combat initative number~~
		* ~~card number (collection)~~
	* ~~Polish card images, remove white pixels on edge in Photoshop and improve textures~~
		* ~~Blank-FP-Card-1 (remove white background on card #)~~
		* ~~Blank-FP-Card-2 (remove white background on card #)~~
		* ~~Blank-FP-Card-3 (remove white background on card #)~~
		* ~~Blank-FP-Card-4 (remove white background on card #)~~
		* ~~Blank-Shadow-Card-4 (need to move right slightly)~~
* __Search feature__
	* create search function to find card titles in DB
		* ensure card type icons are set
		* ~~ensure correct card bg and card size are chosed~~
	* ~~enable fuzzy searching~~
	* enable all text fields to be queried, not just card titles
* __Type-ahead & suggestions__
	* get basic type-ahead feature to work
	* ensure search function and type-ahead searchs multiple parts of a card for a keyword, not just event title
	* ensure type-ahead suggestions can be navigated and selected with arrow keys + enter
* __Data Entry__
	* enter all 100+ cards into the system (might have to do this manually)
	* add improved text for all cards
	* check for typos
	* check for typos AGAIN
* __Deploy__
	* perform basic linting
	* clean up code for readability
	* push to Heroku