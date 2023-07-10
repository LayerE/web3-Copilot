import { Analytics, User, EarlyAccess, Feedback,Conversation } from '../models/index.js';


const updateFeedback = async (req, res) => {
    try {
      const { id, feedback, isHelpful } = req.body;
      if (!id || !isHelpful) {
        return res.status(400).json({ message: 'Bad request' });
      }
      const updatedFields = {
        feedback,
        isHelpful: isHelpful === 'true',
      };
      const result = await Analytics.findOneAndUpdate({ messageID: id }, updatedFields);
      if (!result) {
        console.log('Error updating feedback');
        return res.status(400).json({ message: 'Bad request' });
      }
      return res.status(200).json({ message: 'Feedback updated' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  const UserAnalytics = async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: null,
            totalWallets: { $sum: 1 },
            connectedTwitter: { $sum: { $cond: [{ $eq: ['$isTwitterConnected', true] }, 1, 0] } },
            connectedDiscord: { $sum: { $cond: [{ $eq: ['$isDiscordConnected', true] }, 1, 0] } },
            twitterFollowed: { $sum: { $cond: [{ $eq: ['$isTwitterFollowed', true] }, 1, 0] } },
            discordJoined: { $sum: { $cond: [{ $eq: ['$isServerJoined', true] }, 1, 0] } },
            twitterRetweeted: { $sum: { $cond: [{ $eq: ['$isTwitterRetweeted', true] }, 1, 0] } },
            referralsDone: { $sum: { $size: { $ifNull: ['$referralUsed', []] } } },
            usersJoined24Hrs: {
              $sum: { $cond: [{ $gte: ['$createdAt', new Date(Date.now() - 24 * 60 * 60 * 1000)] }, 1, 0] },
            },
          },
        },
      ];

      const result = await User.aggregate(pipeline);
      const totalFeedback = await Feedback.countDocuments({});

      if (result.length === 0) {
        return res.status(200).json({
          totalWallets: 0,
          connectedTwitter: 0,
          connectedDiscord: 0,
          twitterFollowed: 0,
          discordJoined: 0,
          twitterRetweeted: 0,
          referralsDone: 0,
          usersJoined24Hrs: 0,
          totalFeedback,
        });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


const getAllUsers = async (req, res) => {
    try{
        const users = await User.find({}).lean();
        return res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const FeedbackAnalytics = async (req, res) => {
    try{
        const [helpfulCount, notHelpfulCount] = await Promise.all([
            Analytics.countDocuments({ isHelpful: true }),
            Analytics.countDocuments({ isHelpful: false }),
          ]);

          return res.status(200).json({
            helpful: helpfulCount,
            notHelpful: notHelpfulCount,
          });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const promptAnalytics = async (req, res) => {
    try{
        const prompts = await Analytics.find({}, { __v: 0 }).sort({ createdAt: -1 }).lean();
        const data = prompts.map(prompt => ({
          ...prompt,
          feedback: prompt.isHelpful === undefined ? "no feedback" : prompt.isHelpful ? "positive" : "negative",
        }));

        return res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const earlyAccessSignup = async (req, res) => {
    try{
        const users = await EarlyAccess.find({}).lean();
        return res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const TotalChatSessions = async (req, res) => {
    try{
      const pipeline = [
        {
          $group: {
            _id: null,
            sessionsCount: { $sum: 1 },
            sessionsCount24Hrs: {
              $sum: { $cond: [{ $gte: ['$createdAt', new Date(Date.now() - 24 * 60 * 60 * 1000)] }, 1, 0] },
            },
            sessionsCount7Days: {
              $sum: { $cond: [{ $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] }, 1, 0] },
            },
          },
        },
      ];

      const samplePrompts = [
        "Top PFP projects on Polygon",
        "Give me a smart contract code to deploy for a ERC 721",
        "Guide to becoming a Polygon validator",
        "Mint me a zkEVM NFT",
        "How do I begin my journey on Polygon",
        "Projects with the highest volume over the last 24 hours",
        "What are the top NFT collections on Polygon?",
        "What's up with zkevm ser?",
        "How do I go flexing my Polygon NFTs?",
      ];

      const samplePromptsCount = await Analytics.countDocuments({ prompt: { $in: samplePrompts } });

      const totalRegenerated = await Analytics.countDocuments({ isRegenerated: true });

      const result = await Conversation.aggregate(pipeline);
      if (result.length === 0) {
      return res.status(200).json({
        sessionsCount: 0,
        sessionsCount24Hrs: 0,
        sessionsCount7Days: 0,
        samplePromptsCount,
        totalRegenerated,
      });
    }
     return res.status(200).json({
        ...result[0],
        samplePromptsCount,
        totalRegenerated,
     });
  }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const UpdateMintAndContractDeployment = async (req, res) => {
    try{
      const { id, hash, chain,type } = req.body;
      if (!id || !hash || !chain) {
        return res.status(400).json({ message: 'Bad request' });
      }
      const updatedFields = {
       [type === "mint" ? "isMinted" : "isContractDeployed"]: true,
        hash,
        chain,
      };
      const results = await Analytics.findOneAndUpdate({ messageID: id }, updatedFields);
      if (!results) return res.status(400).json({ message: 'Update failed' });
      return res.status(200).json({ message: 'Updated' });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const TokenBased = async (req, res) => {
  try {
    const getAverageLength = async (persona) => {
      const pipeline = [
        {
          $match: {
            persona,
          },
        },
        {
          $group: {
            _id: null,
            averageLength: {
              $avg: {
                $strLenCP: {
                  $ifNull: ['$prompt', ''],
                },
              },
            },
          },
        },
      ];

      const result = await Analytics.aggregate(pipeline);
      return result[0]?.averageLength || 0;
    };

    const personaList = ['stats', 'stats - neutral', 'mintNFT'];

    const [
      avgLength,
      mintLength,
      statsLength,
      positiveFeedbackOnStats,
      negativeFeedbackOnStats,
      totalDappRadar,
      totalContractCode,
      positiveFeedbackOnContract,
      negativeFeedbackOnContract,
      totalDeployedContracts,
      totalMintedNFTs,
    ] = await Promise.all([
      getAverageLength({ $nin: personaList }),
      getAverageLength('mintNFT'),
      getAverageLength({ $in: personaList.slice(0, 2) }),
      Analytics.countDocuments({ persona: 'stats', isHelpful: true }),
      Analytics.countDocuments({ persona: 'stats', isHelpful: false }),
      Analytics.countDocuments({ type: 'dapp-radar' }),
      Analytics.countDocuments({ type: 'contract' }),
      Analytics.countDocuments({ persona: 'contract', isHelpful: true }),
      Analytics.countDocuments({ persona: 'contract', isHelpful: false }),
      Analytics.countDocuments({ isContractDeployed: true }),
      Analytics.countDocuments({ isMinted: true }),
    ]);

    return res.status(200).json({
      avgLength: avgLength.toFixed(2),
      mintLength: mintLength.toFixed(2),
      statsLength: statsLength.toFixed(2),
      positiveFeedbackOnStats,
      negativeFeedbackOnStats,
      totalDappRadar,
      totalContractCode,
      positiveFeedbackOnContract,
      negativeFeedbackOnContract,
      totalDeployedContracts,
      totalMintedNFTs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





export {
    updateFeedback,
    UserAnalytics,
    getAllUsers,
    FeedbackAnalytics,
    promptAnalytics,
    earlyAccessSignup,
    TotalChatSessions,
    UpdateMintAndContractDeployment,
    TokenBased
}