const apiBaseUrl =
  (import.meta as any).env?.NG_APP_API_BASE_URL || 'http://localhost:3333';

export const environment = {
  production: false,
  apiBaseUrl,
};
