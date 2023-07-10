import { EarlyAccess,Feedback,User } from "../models/index.js";

const earlyAccess = async (req, res) => {
    try{
        const { email } = req.body;
        const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || isEmailRegex.test(email) === false ){
            return res.status(400).json({ message: "Bad request" });
        }
        const user = await EarlyAccess?.countDocuments({ email: email });
        if(user > 0){
            return res.status(200).json({ message: "Success" });
        }
        await EarlyAccess.create({ email: email });
        return res.status(200).json({ message: "Success" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

// webhook for feedback from tally 
const feedbackHook = async (req, res) => {
    try {
        const { data } = req.body;
        let { type = "short" } = req.query;
        if (!data) {
            return res.status(400).json({ message: 'Bad request No Data' });
        }
        const walletFieldLabels = ["Please paste your wallet address below", "Please paste your wallet address here"];
        const walletField = data?.fields?.find(field => walletFieldLabels.some(label => field.label?.includes(label)));
        const wallet = walletField ? walletField.value : "false";
        const feedback = await Feedback.create({ data: data.fields ?? [], feedbackType: type, wallet });
        if (!feedback) {
            console.log('Error updating feedback');
            return res.status(400).json({ message: 'Bad request' });
        }
        if (wallet !== "false") {
            const userFeedbackCount = await Feedback.countDocuments({ wallet });
            if (userFeedbackCount <= 1) {
                console.log("updating user tokens");
                const tokensToAdd = 5;
                await User.updateOne({ wallet }, { $inc: { tokens: tokensToAdd } });
            }
        }
        return res.status(200).json({ message: 'Feedback updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




export {
    earlyAccess,
    feedbackHook,
};