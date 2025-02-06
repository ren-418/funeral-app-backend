import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    id: {
        type: String,
        default: "",
    },
    userId: {
        type: String,
        default: "",
    },
    amount: {
        type: Number,
        default: ""
    },
    created: {
        type: Number,
        default: 0,
    }
});

const Transaction = mongoose.model("transaction", transactionSchema);

const transactionModels = {
    Transaction
}

export default transactionModels;