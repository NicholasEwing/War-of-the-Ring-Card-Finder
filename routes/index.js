const express = require('express');
const router = express.Router();
const CardController = require("../controllers/cardController");

/* GET home page. */
router.route("/")
	.get(CardController.getCards)

module.exports = router;
