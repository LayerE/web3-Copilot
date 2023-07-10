import { User } from '../../models/index.js';

export async function decrementTokens(wallet, model) {
    const availableTokens = await User.findOne({ wallet }).lean().select('tokens');
    const tokenDecrement = model === 'gpt-4' ? 3 : 1;
    if (availableTokens?.tokens <= 3 && model === 'gpt-4') {
        await User.findOneAndUpdate({ wallet }, { tokens: 0 });
    } else {
        await User.findOneAndUpdate({ wallet }, { $inc: { tokens: -tokenDecrement } });
    }
}
