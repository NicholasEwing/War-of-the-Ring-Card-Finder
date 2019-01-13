const mongoose = require("mongoose");

// event card schema
const cardSchema = new mongoose.Schema({
	// Event section
	// TODO: Add trim to strings
	eventTitle: {type: String, unique: true, required: true},
	cardSize: {type: Number, required: true},
	deckSource: {type: String, required: true}, // options: Character Deck, Strategy Deck
	faction: {type: String, required: true}, // options: shadow, fp
	type: {type: String, required: true}, // types: Character, Army, Muster
	precondition: String,
	improvedPrecondition: String,
	specialHuntTileImg: String,
	eventText: {type: String, required: true},
	improvedEventText: String,
	discardCondition: String,
	improvedDiscardCondition: String,

	// Combat section
	combatTitle: {type: String, required: true},
	combatPrecondition: String,
	improvedCombatPrecondition: String,
	combatText: {type: String, required: true},
	improvedCombatText: String,
	initiativeNumber: {type: String, required: true}, // *see notes

	cardNumber: {type: String, required: true} // ex: (3/24)
	}, {collection: "cards"});

// *Notes:
//	Must use String instead of Int since some cards
// (like "Mumakil") have varying initative numbers (3 - 5)

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;