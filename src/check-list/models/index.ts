import mongoose from "mongoose";
const Schema = mongoose.Schema;

const checkListSchema = new Schema({
    id: {
        type: String,
        default: "",
    },
    userId: {
        type: String,
        default: "",
    },
    desc: {
        type: String,
        default: "",
    },
    completd: {
        type: Boolean,
        default: false
    },
    created: {
        type: Number,
        default: 0,
    },
    sharedTo: {
        type: [String],
        default: []
    }
});

const CheckList = mongoose.model("checkList", checkListSchema);

const checkListModels = {
    CheckList
}

export default checkListModels;