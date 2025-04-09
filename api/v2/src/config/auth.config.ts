import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME) || 3600,
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
    refreshExpiresIn:
      parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) || 86400,
  },
}));
