import mongoose from 'mongoose';

import { Schema } from 'mongoose';

const feedbackSchema = new Schema(
    {
        wallet: {
            type: String,
            required: true,
        },
        feedbackType: {
            type: String,
            required: false,
            default: "short",
        },
        data:{
            type: Array,
            required: false,
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
