import mongoose from "mongoose";
const Schema = mongoose.Schema;

const checkListSchema = new Schema({
    title: {
        type: String,
        default: "",
    },
    desc: {
        type: String,
        default: "",
    },
    completd: {
        type:Boolean,
        default:false
    },
    created: {
        type: Number,
        default: 0,
    }
});

const CheckList = mongoose.model("checkList", checkListSchema);

const checkListModels = {
    CheckList
}

export default checkListModels;