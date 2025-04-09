import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  ttl: parseInt(process.env.CACHE_TTL) || 60 * 60 * 1000, // Default 1 hour
}));
