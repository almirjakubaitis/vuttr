import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

// Armazena o IP e quantas requisções feitas no intervalo

const redisClinet = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClinet,
  keyPrefix: 'rateLimit', // must be unique for limiters with different purpose
  points: 20, // Number of points
  duration: 1, // Per second(s)

  // Custom
  execEvenly: false, // Do not delay actions evenly
  blockDuration: 0, // Do not block if consumed more than points
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('Too many request', 429);
  }
}
