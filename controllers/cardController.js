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
	},
	createCard : async (req, res) => {
		try {
			const newCard = await Card.create(req.body);
			newCard.specialHuntTileImg = `/images/${req.file.filename}`;
			await newCard.save();
			console.log("Created new card!");
			res.redirect("/");
		} catch(err) {
			res.send("Couldn't create card!");
			console.log(err);
		}
	}
}