const express = require('express');
const router = express.Router();
const CardController = require("../controllers/cardController");

// *****************************************************
// You can re-enable multer and the /create route for
// local development when you clone this repo.
// Use /create to add cards, card images, or other 
// information.

// const multer = require("multer");
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "./public/images");
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, file.originalname);
// 	}
// });
// const upload = multer({storage: storage});

// *****************************************************

router.route("/")
	.get(CardController.getCard)
	// .post(upload.single("specialHuntTileImg"), CardController.createCard);

// router.route("/create")
// 	.get(CardController.getCreationForm)

module.exports = router;
