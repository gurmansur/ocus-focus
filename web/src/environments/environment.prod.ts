/**
 * Production environment configuration
 *
 * Environment variables must be set via .env or deployment configuration
 * Example:
 *   NG_APP_API_BASE_URL=https://api.ocus-focus.com
 */

const apiBaseUrl = (import.meta as any).env?.NG_APP_API_BASE_URL || '';

const apiTimeout = parseInt(
  (import.meta as any).env?.NG_APP_API_TIMEOUT || '30000',
  10,
);

const logLevel = (import.meta as any).env?.NG_APP_LOG_LEVEL || 'error';

export const environment = {
  production: true,
  apiBaseUrl,
  apiTimeout,
  logLevel,
  cache: {
    enabled: true,
    ttl: 30 * 60 * 1000, // 30 minutes in production
  },
  auth: {
    tokenKey: 'token',
    userIdKey: 'usu_id',
    userEmailKey: 'usu_email',
    userNameKey: 'usu_name',
    userRoleKey: 'usu_role',
  },
};
