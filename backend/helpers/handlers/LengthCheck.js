import { encoding_for_model } from '@dqbd/tiktoken';

export const LengthCheck = async (message, res) => {
    const encoding = encoding_for_model('gpt-4');
    if (encoding.encode(message).length > 1024) {
        encoding.free();
        return res.status(400).json({ message: 'Message too long' });
    }
    encoding.free();
};
