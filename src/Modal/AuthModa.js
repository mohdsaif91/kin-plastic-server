const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
	userName: {
		require: true,
		type: String,
	},
	password: {
		require: true,
		type: String,
	},
});

const authModal = mongoose.model('auth', authSchema);

module.exports = authModal;
