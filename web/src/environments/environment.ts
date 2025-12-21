/**
 * Development environment configuration
 *
 * Environment variables can be set via .env file or process.env
 * Examples:
 *   NG_APP_API_BASE_URL=http://localhost:3333
 *   NG_APP_API_TIMEOUT=30000
 *   NG_APP_LOG_LEVEL=debug
 */

const apiBaseUrl =
  (import.meta as any).env?.NG_APP_API_BASE_URL || 'http://localhost:3333';

const apiTimeout = parseInt(
  (import.meta as any).env?.NG_APP_API_TIMEOUT || '30000',
  10,
);

const logLevel = (import.meta as any).env?.NG_APP_LOG_LEVEL || 'info';

export const environment = {
  production: false,
  apiBaseUrl,
  apiTimeout,
  logLevel,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
  auth: {
    tokenKey: 'token',
    userIdKey: 'usu_id',
    userEmailKey: 'usu_email',
    userNameKey: 'usu_name',
    userRoleKey: 'usu_role',
  },
};
