import mongoose from "mongoose";


const { Schema } = mongoose;

const analyticsSchema = new Schema(
    {
     messageID: {
        type: String,
        required: true,
    },
      wallet: {
        type: String,
        required: false,
    },
      prompt: {
          type: String,
          required: true
      },
      persona : {
            type: String,
            required: true
        },
      response: {
          type: String,
          required: true
      },
      feedback: {
        type: String,
        required: false,
        default: "false",
      },
      isHelpful: {
        type: Boolean,
        required: false,
      },
      isAPIKeyUsed: {
        type: Boolean,
        required: false,
        default: false,
      },
      model: {
        type: String,
        required: false,
        default: "gpt-3.5-turbo",
      },
      isMinted: {
        type: Boolean,
        required: false,
      },
      hash: {
        type: String,
        required: false,
      },
      chain: {
        type: String,
        required: false,
      },
      isContractDeployed: {
        type: Boolean,
        required: false,
      },
      sourceAndSuggestions: {
        type: Boolean,
        required: false,
      },
      isRegenerated: {
        type: Boolean,
        required: false,
      },
      type: {
        type: String,
        required: false,
      }
    },
    {
      timestamps: true,
    }
  );
  
  const Analytics = mongoose.model("Analytics", analyticsSchema);

 export default Analytics;