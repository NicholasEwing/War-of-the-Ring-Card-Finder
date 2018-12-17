const mongoose = require("mongoose");

// event card schema
const cardSchema = new mongoose.Schema({
	// Event section
	eventTitle: {type: String, unique: true, required: true},
	deckSource: {type: String, required: true}, // options: Character Deck, Strategy Deck
	faction: {type: String, required: true}, // options: Shadow, Free Peoples
	type: {type: String, required: true}, // types: Character, Army, Muster
	specialHuntTileImg: String,
	precondition: String,
	eventText: {type: String, required: true},
	improvedEventText: {type: String, required: true},
	discardCondition: String,

	// Combat section
	combatTitle: {type: String, required: true},
	combatPrecondition: String,
	combatText: {type: String, required: true},
	initiativeNumber: {type: String, required: true}, // *see notes

	cardNumber: {type: String, required: true} // ex: (3/24)
	}, {collection: "cards"});

// *Notes:
//	Must use String instead of Int since some cards
// (like "Mumakil") have varying initative numbers (3 - 5)

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;