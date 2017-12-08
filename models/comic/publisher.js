// Required modules
const mongoose	= require('mongoose');
const Schema		= mongoose.Schema;

const publisherSchema = new Schema({
	'aliases': String,
	'api_detail_url': String,
	'characters': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'date_added': Date,
	'date_last_updated': Date,
	'deck': String,
	'description': String,
	'id': {
		type: Number,
		required: true,
		unique: true
	},
	'image': {
		'icon_url': String,
		'medium_url': String,
		'screen_url': String,
		'screen_large_url': String,
		'small_url': String,
		'super_url': String,
		'thumb_url': String,
		'tiny_url': String,
		'original_url': String,
		'image_tags': String
	},
	'location_address': String,
	'location_city': String,
	'location_state': String,
	'name': String,
	'site_detail_url': String,
	'story_arcs': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'teams': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'volumes': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	]
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
