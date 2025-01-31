import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VaultSchema = new Schema({
    userId: { type: String, default: '' },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    created: {
        type: Number,
        default: 0,
    },
    sharedTo: {
        type: [String],
        default: []
    },
    filePath: { type: String, required: true, default: "" },
    fileType: { type: String, required: true },

});
const vault = mongoose.model("vault", VaultSchema);

const vaultModels = {
    vault
}

export default vaultModels;