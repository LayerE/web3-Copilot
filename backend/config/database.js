import { connect } from 'mongoose';
import redis from 'redis';

const URL = process.env.DATABASE;

const connectDB = async () => {
    try {
        const mongoURI = URL;
        const options = {
            dbName: process.env.DATABASE_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await connect(mongoURI, options);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const redisClient = redis.createClient({
    url: process.env.REDIS,
});
redisClient.connect();

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

export { connectDB, redisClient };
