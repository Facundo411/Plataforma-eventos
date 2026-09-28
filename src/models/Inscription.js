import mongoose from "mongoose";

const inscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Inscription = mongoose.model("Inscription", inscriptionSchema);

export default Inscription;