import { Queue } from 'bullmq';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redisConnectionOptions = {
  host: redisHost,
  port: redisPort,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

export const questionQueue = new Queue('question-generation', {
  connection: redisConnectionOptions,
});

console.log(`BullMQ 'question-generation' Queue initialized (Redis: ${redisHost}:${redisPort})`);
