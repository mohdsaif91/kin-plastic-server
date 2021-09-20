const mongoose = require('mongoose');

const settingHomeSchema = mongoose.Schema({
	homeHeroColor: {
		require: true,
		type: String,
	},
});

const settingHomeModal = mongoose.model('setting', settingHomeSchema);

module.exports = settingHomeModal;
