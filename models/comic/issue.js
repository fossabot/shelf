// Required modules
const mongoose	= require('mongoose');
const Schema		= mongoose.Schema;

const issueSchema = new Schema({
	'aliases': String,
	'api_detail_url': String,
	'character_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'character_died_in': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'concept_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'cover_date': Date,
	'date_added': Date,
	'date_last_updated': Date,
	'deck': String,
	'description': String,
	'first_appearance_characters': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'first_appearance_concepts': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'first_appearance_locations': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'first_appearance_objects': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'first_appearance_storyarcs': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'first_appearance_teams': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'has_staff_review': Boolean,
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
	'issue_number': Number,
	'location_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'name': String,
	'object_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'person_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String,
			'role': String
		}
	],
	'site_detail_url': String,
	'store_date': Date,
	'story_arc_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'team_credits': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'team_disbanded_in': [
		{
			'api_detail_url': String,
			'id': Number,
			'name': String,
			'site_detail_url': String
		}
	],
	'volume': {
		'api_detail_url': String,
		'id': Number,
		'name': String,
		'site_detail_url': String
	}
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
