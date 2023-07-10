import { encoding_for_model } from '@dqbd/tiktoken';
const encoding = encoding_for_model('gpt-4');

export default function (results, persona,ans, model) {
    try {
        const ansToken = encoding.encode(ans).length
        const limit = (persona === 'validator' ?
        model === 'gpt-4' ? 3500 :
        2500 : model === 'gpt-4' ? 3500 : 2500) - ansToken;
        console.log('model',model)
        console.log(`Token used by previous answer:${ansToken}. New token limit: ${limit}`)
        console.log('Validating data');
        const data = [];
        let totalTokens = 0;
        for (let i = 0; i < results.length && totalTokens <= limit; i++) {
            if (!results[i]) continue;
            const { tokens, ...d } = results[i];
            if (totalTokens + tokens > limit) continue;
            totalTokens += tokens;
            data.push(d);
            console.log(`Site selected: ${d.link}, tokens: ${tokens}`);
        }

        console.log(`Total Tokens before JSON Stringify: ${totalTokens}`);
        console.log(
            'Total Tokens for JSON data:',
            encoding.encode(JSON.stringify(data)).length
        );
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
}
