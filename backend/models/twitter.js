import mongoose from "mongoose";
const { Schema } = mongoose;

const TwitterSchema = new Schema({
    wallet: {
        type: String,
        required: true,
        default: "false",
    },
    username: {
        type: String,
        default: false,
    },
    accessToken: {
        type: String,
        default: false,
    },
    accessSecret: {
        type: String,
        default: false,
    },
    twitter_id: {
        type: String,
        default: false,
    },
    redirect: {
        type: String,
        default: false,
    },
},{
    timestamps: true,
});

const Twitter = mongoose.model("Twitter", TwitterSchema);
export default Twitter;