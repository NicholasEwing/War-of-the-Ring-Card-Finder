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
			console.log("------- REQ.FILE ---------");
			console.log(req.file);
			console.log("--------------------------");
			const newCard = await Card.create(req.body);
			newCard.specialHuntTileImg = req.file.path;
			console.log("special hunt tile img property")
			console.log(newCard.specialHuntTileImg);
			await newCard.save();
			console.log("Created new card! Printing result");
			console.log(newCard);
			res.redirect("/");
		} catch(err) {
			res.send("Couldn't create card!");
			console.log(err);
		}
	}
}