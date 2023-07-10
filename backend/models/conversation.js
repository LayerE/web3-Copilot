import mongoose from 'mongoose';

import { v4 as uuidv4 } from 'uuid';
const conversationSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    wallet: { type: String, default: null },
    chats: {
        questions: [{ type: String }],
        answers: [{ type: String }],
    },
}, {
    timestamps: true,
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
