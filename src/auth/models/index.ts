import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
	name: {
		type: String,
		default: "",
	},
	email: {
		type: String,
		default: "",
	},
	address: {
		type: String,
		default: '',
	},
	lasttime: {
		type: Number,
		default: 0,
	},
	created: {
		type: Number,
		default: 0,
	}
});

const Auth = mongoose.model("auths", AuthSchema);

const AuthModels = {
	Auth
}

export default AuthModels;