import { Queue } from 'bullmq';

export const redisConnectionOptions = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD!,
  tls: {},
  maxRetriesPerRequest: null,
};

export const questionQueue = new Queue('question-generation', {
  connection: redisConnectionOptions,
});

console.log(
  `BullMQ Queue initialized (${process.env.REDIS_HOST}:${process.env.REDIS_PORT})`
);