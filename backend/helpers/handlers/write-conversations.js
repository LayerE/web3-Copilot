import { Conversation } from '../../models/index.js';
export default async function (conversationId, message, answer, wallet) {
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            const conversation = new Conversation({
                _id: conversationId,
                wallet: wallet || null,
                chats: {
                    questions: [message],
                    answers: [answer],
                },
            });
            await conversation.save();
            return;
        }
        conversation.chats.questions.push(message);
        conversation.chats.answers.push(answer);

        await conversation.save();
    } catch (error) {
        console.log(error);
    }
}
