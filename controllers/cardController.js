const Card = require("../models/card");
const mongoose = require("mongoose");

module.exports = {
	getCard : async (req, res) => {
		try {
			const card = await Card.findOne({eventTitle : "Balrog of Moria"});
			return res.render("index", {card: card});
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
			
			if(req.file) {
				newCard.specialHuntTileImg = `/images/${req.file.filename}`;
			}

			await newCard.save();
			console.log("Created new card!");
			res.redirect("/create");
		} catch(err) {
			res.send("Couldn't create card!");
			console.log(err);
		}
	}
}