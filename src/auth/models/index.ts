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
	password: {
		type:String,
		default:""
	},
	subscription: {
		type:Number,
		default:null
	},
	isFullAccess: {
		type:Boolean,
		default:true
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