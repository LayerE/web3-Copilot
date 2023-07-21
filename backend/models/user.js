import mongoose from "mongoose";

import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const userSchema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
    },
    referralUsed: {
      type: Array,
      required: false,
      default: [],
    },
    referralCode: {
      type: String,
      required: false,
      default: uuidv4(),
    },
    tokens: {
      type: Number,
      required: false,
      default: 25,
    },
    isTwitterConnected: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDiscordConnected: {
      type: Boolean,
      required: false,
      default: false,
    },
    twitterID: {
      type: String,
      required: false,
      default: "false",
    },
    discordID: {
      type: String,
      required: false,
      default: "false",
    },
    isTwitterFollowed: {
      type: Boolean,
      required: false,
      default: false,
    },
    isServerJoined: {
      type: Boolean,
      required: false,
      default: false,
    },
    isTwitterRetweeted: {
      type: Boolean,
      required: false,
      default: false,
    },
    tokenRefreshTime: {
      type: Date,
      required: false,
      default: Date.now(),
    },
    socialLinkShareTime: {
      type: Date,
      required: false,
    },
    secretCode: {
      type: String,
      required: false,
    },
    faucetTokenRefreshTime: {
      type: Date,
      required: false,
    },
    zkEVMFaucetTokenRefreshTime: {
      type: Date,
      required: false,
    },
    mainnetFaucetTokenRefreshTime: {
      type: Date,
      required: false,
    },
    totalTokensEarned: {
      type: Number,
      required: false,
      default: 0,
    },
    isAlreadyLoggedIn: {
      type: Boolean,
      required: false,
    },
    oneTimeBonus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
