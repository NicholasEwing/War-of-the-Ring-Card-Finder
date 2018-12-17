const express = require('express');
const router = express.Router();
const CardController = require("../controllers/cardController");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});
const upload = multer({storage: storage});

/* GET home page. */
router.route("/")
	.get(CardController.getCards)
	// make file upload keep original filename
	.post(upload.single("specialHuntTileImg"), CardController.createCard);

router.route("/create")
	.get(CardController.getCreationForm)

module.exports = router;
