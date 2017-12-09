// Required modules
const mongoose	= require('mongoose');
const bcrypt		= require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	'type': String,
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

// Really hate that this isn't an arrow function, but it has to be
// https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
