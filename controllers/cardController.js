const Card = require("../models/card");
const mongoose = require("mongoose");

module.exports = {
	getCards : async (req, res) => {
		try {
			const cards = await Card.find({});
			return res.render("index", {cards: cards});
		} catch(err) {
			res.send("Something went wrong!");
			console.log(err);
		}
	}
}