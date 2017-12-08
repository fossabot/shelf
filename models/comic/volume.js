// Required modules
const mongoose	= require('mongoose');
const Schema		= mongoose.Schema;

const volumeSchema = new Schema({
	'aliases': String,
	'api_detail_url': String,
	'characters': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'count': String
		}
	],
	'concepts': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'count': String
		}
	],
	'count_of_issues': Number,
	'date_added': Date,
	'date_last_updated': Date,
	'deck': String,
	'description': String,
	'first_issue': {
		'api_detail_url': String,
		'id': Number,
		'name': String,
		'issue_number': String
	},
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
	'issues': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'issue_number': String
		}
	],
	'last_issue': {
		'api_detail_url': String,
		'id': Number,
		'name': String,
		'issue_number': String
	},
	'locations': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'count': String
		}
	],
	'name': String,
	'objects': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'count': String
		}
	],
	'people': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'count': String
		}
	],
	'publisher': {
		'api_detail_url': String,
		'id': Number,
		'name': String
	},
	'site_detail_url': String,
	'start_year': String
});

const Volume = mongoose.model('Volume', volumeSchema);

module.exports = Volume;
