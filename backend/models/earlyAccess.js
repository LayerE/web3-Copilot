import mongoose from 'mongoose';


import { Schema } from 'mongoose';

const earlySchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const EarlyAccess = mongoose.model('EarlyAccess', earlySchema);
export default EarlyAccess;
