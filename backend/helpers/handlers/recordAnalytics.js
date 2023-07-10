import { writeConversations } from "../index.js";
import { Analytics } from "../../models/index.js";

export async function recordAnalyticsAndWriteConversation(
    id,
    wallet,
    message,
    answer,
    apiKey,
    model,
    conversationId,
    persona,
    isRegenerated,
    isSourceAndSuggestions,
    type,
) {

    await Analytics.create({
        messageID: id,
        wallet,
        prompt: message,
        persona: persona,
        response: answer,
        isAPIKeyUsed: !!apiKey,
        model,
        isRegenerated,
        sourceAndSuggestions: isSourceAndSuggestions,
        type,
    });

    await writeConversations(conversationId, message, answer, wallet);
}