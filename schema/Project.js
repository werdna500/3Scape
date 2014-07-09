var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProjectSchema   = new Schema({
	creator : { type: Schema.Types.ObjectId, ref: 'User' },
	title : String,
	// serXML: String
});

module.exports = mongoose.model('Project', ProjectSchema);