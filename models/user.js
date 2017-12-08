// Required modules
const mongoose	= require('mongoose');
const bcrypt		= require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	'local': {
		'email': String,
		'password': String
	},
	'facebook': {
		'id': String,
		'token': String,
		'name': String,
		'email': String
	},
	'twitter': {
		'id': String,
		'token': String,
		'displayName': String,
		'username': String
	},
	'google': {
		'id': String,
		'token': String,
		'email': String,
		'name': String
	}
});

userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password) => {
	return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
