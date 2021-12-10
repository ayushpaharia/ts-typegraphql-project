import Redis from "ioredis";

export const redis = new Redis({
  port: (process.env.REDIS_PORT as any) || 6379,
  password: process.env.REDIS_PASSWORD || process.env.REDIS_PW,
});
