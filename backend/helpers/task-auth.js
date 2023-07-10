import { TwitterApi } from "twitter-api-v2";
import axios from "axios";

import { requestClient,TOKENS } from "../config/twitterConfig.js";
import { Twitter,Discord, User } from "../models/index.js";
const DiscordAccount = async (wallet, redirect_uri) => {
    const user = await Discord.findOne({ wallet: wallet });
    if (!user) {
      const data = await Discord.create({
        wallet,
        redirect: redirect_uri,
      });
      return data;
    }
    await Discord.updateOne({ wallet }, { redirect: redirect_uri });
    return user;
  };
  
  const UpdateDiscordCredentials = async (
    wallet,
    accessToken,
    refreshToken,
    username,
    userID
  ) => {
    const user = await Discord.findOne({ wallet: wallet });   
    if (!user) {
      return { error: "User not found" };
    }
    await Discord.updateOne(
      { wallet: wallet },
      { accessToken, refreshToken, username, discord_id: userID }
    );
    await User.findOneAndUpdate(
        { wallet: wallet },
        { isDiscordConnected: true, discordID: username }
        );
      
    return user?.redirect;
  };
  
  const FetchTwitter = async (wallet) => {
    try {
      const user = await Twitter.findOne({ wallet });
      if (!user) {
        return { error: "User not logged in" };
      }
      if(user && user?.username !== "false"){
        return user;
      }
      return { error: "User not logged in" };
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };
  
  const FetchDiscord = async (wallet) => {
    try {
      const user = await Discord.findOne({ wallet });
      if (!user) {
        return { error: "User not logged in" };
      }
      if(user && user?.username !== "false"){
        return user;
      }
      return { error: "User not logged in" };
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };
  
  const TwitterAccount = async (
    wallet,
    redirect_uri,
    oauth_token,
    oauth_token_secret
  ) => {
    const user = await Twitter.findOne({ wallet: wallet });
    if (!user) {
      const data = await Twitter.create({
        wallet: wallet,
        redirect: redirect_uri,
        accessSecret: oauth_token,
        accessToken: oauth_token_secret,
      });
      return data;
    } else {
      const data = await Twitter.findOneAndUpdate(
        { wallet: wallet },
        {
          redirect: redirect_uri,
          accessSecret: oauth_token,
          accessToken: oauth_token_secret,
        }
      );
      return data;
    }
  };
  
  const TwitterAuthTokens = async (oauth_token) => {
    const user = await Twitter.findOne({ accessSecret: oauth_token });
    if (!user) return { error: "User not found" };
    return { user };
  };
  
  const UpdateTwitterCredentials = async (
    wallet,
    accessToken,
    accessSecret,
    username,
    userID
  ) => {
    const user = await Twitter.findOne({ wallet: wallet });
    if (!user) {
      return { error: "Twitter account not found" };
    } else {
      const data = await Twitter.findOneAndUpdate(
        { wallet: wallet },
        {
          accessToken: accessToken,
          accessSecret: accessSecret,
          username: username,
          twitter_id: userID,
        }
      );
     await User.findOneAndUpdate(
        { wallet: wallet },
        { isTwitterConnected: true, twitterID: username }
        );

      return data.redirect;
    }
  };
  
  const TwitterFollow = async (wallet, handle) => {
    const data = await FetchTwitter(wallet);
    if (data?.error) {
      return data?.error;
    }
    const { accessToken, accessSecret, twitter_id, username } = data;
    const client = new TwitterApi({ ...TOKENS, accessToken, accessSecret });
    try {
      let regex = "(?:https?://)?(?:www.)?twitter.com/(?:#!/)?@?([^/?s]*)";
      let TwitterHandle = handle?.includes("https://twitter.com")
        ? handle?.match(regex)[1]
        : handle;
      console.log(TwitterHandle);
      // const FollowCheck = await client.v2.userByUsername(TwitterHandle);
      // hack to avoid V2 api
      let FollowId = "914738730740715521"
      console.log(FollowId);
      // const { relationship } = await client.v1.friendship({
      //   source_id: twitter_id,
      //   target_id: FollowId,
      // });
      // if (relationship.source.following === true) {
      //   return {
      //     follow: true,
      //   };
      // } else {
      //   return { follow: true }
      // }
      // return {
      //   error: "User is not following " + TwitterHandle,
      // };
      return { follow: true };
    } catch (error) {
      console.log(error);
      return { follow: true };
    }
  };
  
  const DiscordGuildCheck = async (wallet, guild) => {
    const user = await FetchDiscord(wallet);
    if (user?.error) return { error: user?.error };
    try {
      const epoch = new Date(user?.updatedAt).getTime();
      let token = user?.accessToken;
      if (epoch < Date.now() - 518400) {
        const { data } = await axios.post(
          "https://discord.com/api/oauth2/token",
          `client_id=${process.env.DISCORD_ID}&client_secret=${process.env.DISCORD_SECRET}&grant_type=refresh_token&refresh_token=${user?.refreshToken}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&scope=identify%20wallet%20guilds`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        await UpdateDiscordCredentials(
          wallet,
          data?.access_token,
          data?.refresh_token,
          user?.username,
          user?.discordId
        );
        token = data?.access_token;
      }
  
      const check = await axios.get("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const guilds = await check.data.map((guild) => guild.id);
      if (guilds.includes(guild)) return { message: "You are in the guild" };
      return { error: "You are not in the guild" };
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };

  const TwitterRetweet = async (email, tweetData) => {
    try {
      const data = await FetchTwitter(email);
      if (data?.error) {
        return data?.error;
      }
      const { accessToken, accessSecret, twitter_id, username } = data;
      const client = new TwitterApi({ ...TOKENS, accessToken, accessSecret });
      let status = false;
      let regex =
        "(?:https?://)?(?:www.)?twitter.com/(?:#!/)?@?([^/?s]*)/status/([^/?s]*)";
      let tweetId = tweetData?.includes("https://twitter.com")
        ? tweetData?.match(regex)[2]
        : tweetData;
      let retweetData = await client.v1.get(
        "statuses/retweets/" + tweetId + ".json",
        {
          id: tweetId,
          count: 1,
        }
      );
      if (retweetData[0]?.retweeted === true) status = true;
      return status === true
        ? status
        : { error: "User has not retweeted the tweet" };
    } catch (error) {
      return error;
    }
  };

  const TwitterTweetCheck = async (email) => {
    try {
      const data = await FetchTwitter(email);
      if (data?.error) {
        return data?.error;
      }
      const { accessToken, accessSecret, twitter_id, username } = data;
      const client = new TwitterApi({ ...TOKENS, accessToken, accessSecret });
      let status = false;
      let tweets = await client.v1.userTimeline(
        "statuses/user_timeline.json",
        {
          id: twitter_id,
          count: 20,
          exclude_replies: true,
          include_rts: false,
        }
      );
      const currentDate = new Date().getDate();
      const currentMonth = new Date().getMonth();
      const tweetCheck = await tweets?._realData?.map((tweet) => {
        if(new Date(tweet.created_at).getDate() === currentDate && new Date(tweet.created_at).getMonth() === currentMonth){
          if(tweet?.entities?.urls[0]?.display_url?.includes("chats?chat_id=")){
            status = true;
            return true;
          }
        }
      });
      console.log(tweetCheck);
    
      return status === true ? status : { error: "User has not shared the url" };
    } catch (error) {
      return error;
    }
  };
  
export {
    DiscordAccount,
    UpdateDiscordCredentials,
    FetchTwitter,
    TwitterAccount,
    TwitterAuthTokens,
    UpdateTwitterCredentials,
    TwitterFollow,
    FetchDiscord,
    DiscordGuildCheck,
    TwitterRetweet,
    TwitterTweetCheck,
  };