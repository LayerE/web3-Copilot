import { User, Feedback,Twitter,Discord } from '../models/index.js';
import { generateToken } from '../utils/jwtToken.js';

import creditsCalc from '../utils/creditsCalc.js';
import { FetchTwitter,FetchDiscord } from '../helpers/task-auth.js';






const LoginController = async (req, res) => {
    try {
        const { wallet, secretCode } = req.body;
        if (!wallet) {
            return res.status(400).json({ message: 'Bad request' });
        }
        let user = await User.findOne({ wallet }).lean();
        if (!user) {
            await User.create({
                wallet,
                tokens: 20,
                isNewUser: true,
                secretCode: secretCode || 'false',
                tokenRefreshTime: new Date(),
                totalTokensEarned: 20,
            });
        } else {
            const tokenRefreshTime = user?.tokenRefreshTime;
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            const shouldRefreshTokens =
                !tokenRefreshTime ||
                tokenRefreshTime < Date.now() - oneDayInMilliseconds;
            if (shouldRefreshTokens) {
                console.log('Updating tokens');
                const newTokens = await creditsCalc(user?.tokens);
                console.log('New tokens:', newTokens);
                await User.updateOne(
                    { wallet },
                    {
                        $inc: { tokens: newTokens, totalTokensEarned: newTokens },
                        $set: { tokenRefreshTime: new Date() },
                    }
                );
                user.tokens += newTokens;
            }
        }
        const token = generateToken({ wallet });
        return res.status(200).json({
            message: 'User logged in',
            isNewUser: !user,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const UserStatusController = async (req, res) => {
    try {
      const { wallet } = req.body;
      if (!wallet) {
        return res.status(400).json({ message: 'Bad request' });
      }
  
      const user = await User.findOne({ wallet }).lean();
      if (!user) {
        return res.status(400).json({ message: 'Bad request' });
      }
  
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
      const shouldRefreshTokens =
        !user.tokenRefreshTime ||
        user.tokenRefreshTime < Date.now() - oneDayInMilliseconds;
  
      if (shouldRefreshTokens) {
        console.log('Updating tokens for user');
        const newTokens = await creditsCalc(user.tokens || 0);
  
        await User.updateOne(
          { wallet },
          {
            $inc: { tokens: newTokens, totalTokensEarned: newTokens },
            $set: { tokenRefreshTime: new Date() },
          }
        );
  
        user.tokens += newTokens;
        user.totalTokensEarned += newTokens;
      }
  
      const referralCount = await User.countDocuments({ referralUsed: user.referralCode });
      const feedbackTask = await Feedback.countDocuments({ wallet });
  
      if (!user.twitterID || !user.discordID) {
        const [twitter, discord] = await Promise.all([
          FetchTwitter(wallet),
          FetchDiscord(wallet),
        ]);
  
        user.twitterID = !twitter?.error ? twitter.username : "false";
        user.discordID = !discord?.error ? discord.username : "false";
      }
  
      user.referredCount = referralCount;
      user.isFeedbackSubmitted = feedbackTask > 0;
      if(!user?.oneTimeBonus && user?.tokenRefreshTime > Date.now() - oneDayInMilliseconds && user?.tokens < 1){
        console.log('Updating tokens for user oneTimeBonus');
        await User.updateOne({ wallet }, { $set: { oneTimeBonus: true }, $inc: { tokens: 15, totalTokensEarned: 15 } });
        user.tokens += 15;
      }
      if (!user.totalTokensEarned) {
        const ptsAdd = [
          user.isTwitterFollowed ? 3 : 0,
          user.isServerJoined ? 4 : 0,
          referralCount * 6,
          feedbackTask * 5,
        ];
        user.totalTokensEarned = ptsAdd.reduce((a, b) => a + b, 0);
        await User.updateOne({ wallet }, { $set: { totalTokensEarned: user.totalTokensEarned } });
      }
  
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const DisconnectSocialsController = async (req, res) => {
    try {
        const { wallet, social } = req.body;
        if (!wallet || !social) {
            return res.status(400).json({ message: 'Bad request' });
        }
        switch (social) {
            case "twitter":
                await Twitter.deleteOne({ wallet });
                await User.findOneAndUpdate({ wallet }, { isTwitterConnected: false, twitterID: "false" });
                break;
            case "discord":
                await Discord.deleteOne({ wallet });
                await User.findOneAndUpdate({ wallet }, { isDiscordConnected: false, discordID: "false" });
                break;
            default:
                return res.status(400).json({ message: 'Bad request' });
        }

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};



export { LoginController, UserStatusController,DisconnectSocialsController };
