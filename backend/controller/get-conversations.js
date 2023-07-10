import { Conversation } from '../models/index.js';

async function getConversationById(req, res) {
    const { conversationId } = req.body;
    if (!conversationId) {
        return res.status(400).json({ message: 'Bad request' });
    }
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        return res.status(200).json({ conversation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getConversationByUser(req, res) {
    const { wallet } = req.body;
    if (!wallet) {
        return res.status(400).json({ message: 'Bad request' });
    }
    try {
        const conversation = await Conversation.find({ wallet: wallet });
        if (conversation.length === 0) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        return res.status(200).json({ conversation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { getConversationById, getConversationByUser };
