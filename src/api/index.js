const express = require('express');

const emojis = require('./emojis');
const Auth = require('./Auth');
const router = express.Router();
const setting = require('./Setting');

router.get('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏',
	});
});

router.use('/emojis', emojis);
router.use('/auth', Auth);
router.use('/setting', setting);

module.exports = router;
