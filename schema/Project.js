'use strict';

exports = module.exports = function(app, mongoose) {
  var projectSchema = new mongoose.Schema({
    // creator : { type: Schema.Types.ObjectId, ref: 'User' },
	title : String,
	// serXML: String
  });
  app.db.model('Project', projectSchema);
};
