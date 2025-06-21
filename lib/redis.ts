import Redis from 'ioredis';

const FIVE_MINUTES = 300;

const redis = new Redis(process.env.REDIS_URL!);

export const challengeStore = {
    async set(walletAddress: string, challenge: string): Promise<void> {
        await redis.setex(
            `challenge:${walletAddress}`,
            FIVE_MINUTES,
            JSON.stringify({ challenge, timestamp: Date.now() })
        );
    },

    async get(walletAddress: string): Promise<{ challenge: string; timestamp: number } | null> {
        const data = await redis.get(`challenge:${walletAddress}`);
        return data ? JSON.parse(data) : null;
    },

    async delete(walletAddress: string): Promise<void> {
        await redis.del(`challenge:${walletAddress}`);
    }
};