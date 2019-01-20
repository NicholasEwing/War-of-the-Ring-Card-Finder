const Card = require("../models/card");
const mongoose = require("mongoose");

module.exports = {
  getCard: async (req, res) => {
    try {
      if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        console.log(regex);
        let results;
        // find all Free Peoples cards if using acronym "fp"
        if (req.query.search === "fp") {
          results = await Card.find({ faction: "fp" });
        } else {
          results = await Card.find({
            $or: [
              { eventTitle: regex },
              { eventText: regex },
              { precondition: regex },
              { discardCondition: regex },
              { combatTitle: regex },
              { combatPrecondition: regex },
              { combatText: regex },
              { faction: regex }
            ]
          });
        }
        res.json(results);
      } else {
        const card = await Card.findOne({ eventTitle: "The Last Battle" });
        res.render("index", { card: card });
      }
    } catch (err) {
      res.send("Something went wrong!");
      console.log(err);
    }
  },
  getCreationForm: async (req, res) => {
    try {
      return res.render("create");
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  },
  createCard: async (req, res) => {
    try {
      const newCard = await Card.create(req.body);

      if (req.file) {
        newCard.specialHuntTileImg = `/images/${req.file.filename}`;
      }

      await newCard.save();
      console.log("Created new card!");
      res.redirect("/create");
    } catch (err) {
      res.send("Couldn't create card!");
      console.log(err);
    }
  },
  test: async (req, res) => {
    try {
      console.log("WOW");
      res.send("bam");
    } catch (err) {
      console.log("Error occurred");
    }
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
