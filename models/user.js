
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: mongoose.Schema.Types.ObjectId,
	password: String,
	email: String

});
