import { User } from '../models/index.js';

import { redisClient } from '../config/database.js';
import RedisStore from 'rate-limit-redis';
import rateLimit from 'express-rate-limit';
import { verifyToken } from '../utils/jwtToken.js';

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // rate limit for 24 hours
    max: 10, // limit each IP to 25 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: async (req, res) => {
        /* status code is 200 for frontend to handle in prompt container */
        return res.status(429).json({
            status: 429,
            message:
                'Exceeded credits for the day please try again tomorrow or earn more credits by completing tasks',
            isAllCreditsUsed: true,
        });
    },
    keyGenerator(req) {
        console.log(req.ip);
        return req.ip;
    },
    /* Use Redis as the store for rate limiting */
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
});

/* 
    This middleware checks if the user is authenticated.
    If the user is authenticated, the request is passed to the next middleware.
    If the user is not authenticated, the request is rate limited.
*/
const isAuth = async (req, res, next) => {
    //ONLY FOR BYPASSING AUTH DURING DEBUGGING SHOULD BE REMOVED LATER
    if (req.body.bypass || req.body.debug) return next();
    try {
        const token = req.headers.authorization;
        if (token && token !== 'null') {
            const decoded = verifyToken(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.body.wallet = decoded.wallet;
        }
        console.log(req.body.wallet);
        const { wallet } = req.body;
        if (wallet) {
            const API_KEY = req.headers['api-key'];
            if (API_KEY !== 'null' || !API_KEY) {
                req.body.apiKey = API_KEY;
            }
            const tokensAvailable = await User.findOne({
                wallet: wallet,
            })?.lean();
            if (
                tokensAvailable !== null &&
                tokensAvailable?.tokens <= 0 &&
                (API_KEY === 'null' || !API_KEY)
            ) {
                return res.status(429).json({
                    status: 429,
                    message:
                        'Exceeded credits for the day please try again tomorrow or earn more credits by completing tasks',
                    isAllCreditsUsed: true,
                });
            }
            next();
        } else {
            // if the user is not logged in, rate limit the request
            limiter(req, res, next);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: 'Internal server error', success: false });
    }
};

const validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.body.wallet = decoded.wallet;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { isAuth, validateToken };
