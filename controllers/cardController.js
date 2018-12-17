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
	getCreationForm : async (req, res) => {
		try {
			return res.render("create");
		} catch(err) {
			console.log(err);
			res.redirect("/")
		}
	},
	createCard : async (req, res) => {
		try {
			const newCard = await Card.create(req.body);
			newCard.specialHuntTileImg = `/images/${req.file.filename}`;
			await newCard.save();
			console.log("Created new card!");
			res.redirect("/create");
		} catch(err) {
			res.send("Couldn't create card!");
			console.log(err);
		}
	}
}