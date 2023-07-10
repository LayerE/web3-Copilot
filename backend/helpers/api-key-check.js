import { Configuration, OpenAIApi } from 'openai';

export default async function (apiKey) {
    try {
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);
        const prompt = ` `;
        const completion = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
            ],
            max_tokens: 1,
        });
        return completion.data.choices[0].message.content;
    } catch (err) {
        return { error: err.message }
    }
}
