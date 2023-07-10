import { TwitterApi } from 'twitter-api-v2';

import axios from 'axios';
import { requestClient, TOKENS } from '../config/twitterConfig.js';
import {
    DiscordAccount,
    UpdateDiscordCredentials,
    FetchTwitter,
    TwitterAccount,
    TwitterAuthTokens,
    UpdateTwitterCredentials,
    TwitterFollow,
    DiscordGuildCheck,
    FetchDiscord,
    TwitterRetweet,
    TwitterTweetCheck,
} from '../helpers/task-auth.js';
import { User } from '../models/index.js';

const TwitterLogin = async (req, res) => {
    const { redirect_uri, wallet } = req.query;
    try {
        const { url, oauth_token, oauth_token_secret } =
            await requestClient.generateAuthLink(
                process.env.TWITTER_CALLBACK_URL
            );
        const data = await TwitterAccount(
            wallet,
            redirect_uri,
            oauth_token,
            oauth_token_secret
        );
        if (data?.error) {
            return res.status(400).json({
                error: data?.error,
            });
        }
        return await res.redirect(
            `${url}&state=${wallet}&redirect=${redirect_uri}`
        );
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error,
        });
    }
};

const TwitterCallback = async (req, res) => {
    if (!req.query.oauth_token || !req.query.oauth_verifier) {
        return res.redirect(process.env.REDIRECT);
    }
    const { oauth_token, oauth_verifier } = req.query;
    try {
        const { user, error } = await TwitterAuthTokens(oauth_token);
        if (error) return res.status(400).json({ error: error });
        const token = oauth_token;
        const verifier = oauth_verifier;
        const savedToken = user?.accessToken;
        const savedSecret = user?.accessSecret;
        if (!savedToken || !savedSecret) {
            return res.redirect(process.env.REDIRECT);
        }

        const tempClient = new TwitterApi({
            ...TOKENS,
            accessToken: token,
            accessSecret: savedSecret,
        });

        const { accessToken, accessSecret, screenName, userId } =
            await tempClient.login(verifier);
        const data = await UpdateTwitterCredentials(
            user?.wallet,
            accessToken,
            accessSecret,
            screenName,
            userId
        );
        if (data?.error) {
            return res.status(400).json({
                error: data?.error,
            });
        }
        // const check = await TwitterFollow(user?.wallet,'https://twitter.com/LayerEhq');
        // if(!check?.error){
        //   const update = await User.findOneAndUpdate({wallet: user?.wallet}, {  $set: {isTwitterFollow: true}, $inc: { tokens: 5 } })
        //   if(!update){
        //     console.log('error updating user')
        //   }
        // }
        return await res.redirect(data);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error,
        });
    }
};

const DiscordLogin = async (req, res) => {
    const { wallet, redirect_uri } = req.query;
    try {
        const data = await DiscordAccount(wallet, redirect_uri);
        if (data?.error) {
            return res.status(400).json({
                error: data?.error,
            });
        }
        return res.redirect(
            `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&response_type=code&scope=identify%20email%20guilds&state=${wallet}`
        );
    } catch (error) {
        return res.status(400).json({
            error: 'Oops! Something went wrong.',
        });
    }
};

const DiscordCallback = async (req, res) => {
    const { state: wallet } = req.query;
    const code = req.query.code;

    const params = new URLSearchParams({
        client_id: process.env.DISCORD_ID,
        client_secret: process.env.DISCORD_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_CALLBACK_URL,
    });

    try {
        if (!wallet) {
            return res.redirect(process.env.REDIRECT);
        }
        const tokenRes = await axios.post(
            'https://discordapp.com/api/oauth2/token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        const user = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenRes.data.access_token}`,
            },
        });

        const data = await UpdateDiscordCredentials(
            wallet,
            tokenRes.data.access_token,
            tokenRes.data.refresh_token,
            user.data.username,
            user.data.id
        );
        if (data?.error) return res.redirect(data + 'error=' + data?.error);
        const check = await DiscordGuildCheck(wallet, '886929449906495498');
        if (!check?.error) {
            const update = await User.findOneAndUpdate(
                { wallet: wallet },
                { $set: { isDiscordServer: true }, $inc: { tokens: 4, totalTokensEarned: 4 } }
            );
            if (!update) {
                console.log('Error updating user');
            }
        }
        return await res.redirect(data);
    } catch (error) {
        console.log(error);
        return res.redirect(process.env.REDIRECT);
    }
};

const TaskVerify = async (req, res) => {
    try {
        const { wallet,taskID } = req.body;
        if (!wallet || !taskID) {
            return res.status(400).json({ error: 'Bad request' });
        }
        const uc = await User.findOne({ wallet: wallet })?.lean();
        if (!uc) {
            return res.status(400).json({ error: 'User not found' });
        }
        switch (Number(taskID)) {
            case 1: {
                const taskCompleted = await User.findOne({
                    wallet: wallet,
                    isTwitterFollowed: true,
                });
                if (taskCompleted) {
                    return res
                        .status(400)
                        .json({ error: 'Follow Task already completed' });
                }
                const data = await FetchTwitter(wallet);
                if (data?.error) {
                    return res.status(400).json({ error: data?.error });
                }
                const check = await TwitterFollow(
                    wallet,
                    'https://twitter.com/0xPolygonLabs'
                );
                if (check?.error) {
                    return res.status(400).json({ error: check?.error });
                }
                const update = await User.findOneAndUpdate(
                    { wallet: wallet },
                    { $set: { isTwitterFollowed: true }, $inc: { tokens: 3,totalTokensEarned: 3 } }
                );
                if (!update) {
                    return res.status(400).json({
                        error: 'Oops! Something went wrong. db Update',
                    });
                }
                return res
                    .status(200)
                    .json({ message: 'Twitter Task Completed successfully.' });
            }
            case 2: {
                const taskCompleted = await User.findOne({
                    wallet: wallet,
                    isServerJoined: true,
                });
                if (taskCompleted) {
                    return res
                        .status(400)
                        .json({ error: 'Task already completed.' });
                }
                const data = await FetchDiscord(wallet);
                if (data?.error) {
                    return res.status(400).json({ error: data?.error });
                }
                const check = await DiscordGuildCheck(
                    wallet,
                    '635865020172861441'
                );
                if (check?.error) {
                    return res.status(400).json({ error: check?.error });
                }
                const update = await User.findOneAndUpdate(
                    { wallet: wallet },
                    { $set: { isServerJoined: true }, $inc: { tokens: 4, totalTokensEarned: 4  } }
                );
                if (!update) {
                    return res
                        .status(400)
                        .json({ error: 'Oops! Something went wrong.' });
                }
                return res
                    .status(200)
                    .json({ message: 'Discord Task Completed successfully.' });
            }
            case 3: {
                const taskCompleted = await User.findOne({
                    wallet: wallet,
                    isTwitterRetweeted: true,
                });
                if (taskCompleted) {
                    return res
                        .status(400)
                        .json({ error: 'Task already completed.' });
                }
                const data = await FetchTwitter(wallet);
                if (data?.error) {
                    return res.status(400).json({ error: data?.error });
                }
                const check = await TwitterRetweet(
                    wallet,
                    'https://twitter.com/LayerEhq/status/1648907280631603200'
                );
                if (check?.error) {
                    return res.status(400).json({ error: check?.error });
                }
                const update = await User.findOneAndUpdate(
                    { wallet: wallet },
                    { $set: { isTwitterRetweeted: true }, $inc: { tokens: 3, totalTokensEarned: 3 } }
                );
                if (!update) {
                    return res
                        .status(400)
                        .json({ error: 'Oops! Something went wrong.' });
                }
                return res.status(200).json({
                    message: 'Twitter Retweet Task Completed successfully.',
                });
            }
            case 4: {
                const { referralCode } = req.body;
                if (!referralCode) { return res.status(400).json({ error: 'Bad request' }); }
                const findRfCode = await User.findOne({ referralCode: referralCode });
                if (!findRfCode) { return res.status(400).json({ error: 'Invalid referral code' }); }
                // check if the user has already used the referral code from the same user
                const c = uc.referralUsed.find((e) => e === referralCode);
                if (c) { return res.status(400).json({ error: 'Referral code already used' }); }
                const upUser = await User.findOneAndUpdate({ wallet: wallet }, { $inc: { tokens: 6, totalTokensEarned: 6  }, $push: { referralUsed: referralCode } });
                const incCredits = await User.findOneAndUpdate({ referralCode: referralCode }, { $inc: { tokens: 6, totalTokensEarned: 6 } });
                if (!upUser || !incCredits) { return res.status(500).json({ error: 'Oops! Something went wrong.' }); }
                return res.status(200).json({ message: 'Referral code verified successfully' });
            }
            case 5: 
            {

                if(!uc?.socialLinkShareTime || (uc?.socialLinkShareTime && uc?.socialLinkShareTime < new Date(Date.now() - 24 * 60 * 60 * 1000))){
                const data = await FetchTwitter(wallet);
                if (data?.error) {
                    return res.status(400).json({ error: data?.error });
                }
                const check = await TwitterTweetCheck(
                    wallet,
                );
                console.log(check);
                if (check?.error) {
                    return res.status(400).json({ error: check?.error });
                }
                await User.findOneAndUpdate(
                    { wallet: wallet },
                    { $set: { socialLinkShareTime: new Date() }, $inc: { tokens: 5, totalTokensEarned: 5 } }
                );
                return res.status(200).json({
                    message: 'Social Link Task Completed successfully.',
                });
                } else {
                    return res.status(400).json({ error: 'Please come back after 24 hours' });
                }
            }
            default:
                return res.status(404).json({ error: 'Invalid Task ID' });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: 'Oops! Something went wrong.',
        });
    }
};

export {
    TwitterLogin,
    TwitterCallback,
    DiscordLogin,
    DiscordCallback,
    TaskVerify,
};
