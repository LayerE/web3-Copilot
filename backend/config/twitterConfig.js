import { TwitterApi } from 'twitter-api-v2';


const TOKENS = {
    appKey: process.env.TWITTER_CLIENT_ID,
    appSecret: process.env.TWITTER_CLIENT_SECRET,
  };
  
 

const requestClient = new TwitterApi({ ...TOKENS });


export {
    requestClient,
    TOKENS,
}