import Redis from 'ioredis';
import { z } from 'zod';

const redis = new Redis(process.env.REDIS_URL!);

const QUEUE_KEY = 'ipfs:upload:queue';
const PROCESSING_KEY = 'ipfs:upload:processing';
const STATUS_KEY_PREFIX = 'ipfs:status:';

export const IpfsJobSchema = z.object({
    postId: z.number(),
    postData: z.object({
        title: z.string(),
        content: z.string(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
    attempts: z.number().default(0),
    createdAt: z.string(),
});

export type IpfsJob = z.infer<typeof IpfsJobSchema>;

export const ipfsQueue = {
    async addJob(job: Omit<IpfsJob, 'attempts' | 'createdAt'>): Promise<void> {
        const jobData: IpfsJob = {
            ...job,
            attempts: 0,
            createdAt: new Date().toISOString(),
        };

        await redis.lpush(QUEUE_KEY, JSON.stringify(jobData));
        await this.updateStatus(job.postId, 'queued');
    },

    async getNextJob(): Promise<IpfsJob | null> {
        const result = await redis.rpoplpush(QUEUE_KEY, PROCESSING_KEY);
        if (!result) return null;

        const job = IpfsJobSchema.parse(JSON.parse(result));
        await this.updateStatus(job.postId, 'processing');
        return job;
    },

    async completeJob(job: IpfsJob): Promise<void> {
        await redis.lrem(PROCESSING_KEY, 1, JSON.stringify(job));
        await this.updateStatus(job.postId, 'completed');
    },

    async failJob(job: IpfsJob, error: string): Promise<void> {
        await redis.lrem(PROCESSING_KEY, 1, JSON.stringify(job));

        if (job.attempts < 3) {
            const retryJob = { ...job, attempts: job.attempts + 1 };
            await redis.lpush(QUEUE_KEY, JSON.stringify(retryJob));
            await this.updateStatus(job.postId, 'retrying', error);
        } else {
            await this.updateStatus(job.postId, 'failed', error);
        }
    },

    async updateStatus(postId: number, status: string, error?: string): Promise<void> {
        const statusData = {
            status,
            error,
            timestamp: Date.now(),
        };
        await redis.setex(
            `${STATUS_KEY_PREFIX}${postId}`,
            86400, // 24 hours
            JSON.stringify(statusData)
        );
    },

    // Get job status
    async getStatus(postId: number): Promise<{ status: string; error?: string; timestamp: number } | null> {
        const data = await redis.get(`${STATUS_KEY_PREFIX}${postId}`);
        return data ? JSON.parse(data) : null;
    },

    // Get queue stats
    async getStats() {
        const [queueLength, processingLength] = await Promise.all([
            redis.llen(QUEUE_KEY),
            redis.llen(PROCESSING_KEY),
        ]);

        return {
            queued: queueLength,
            processing: processingLength,
        };
    },
};