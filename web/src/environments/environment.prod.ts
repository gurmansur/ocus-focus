const apiBaseUrl = (import.meta as any).env?.NG_APP_API_BASE_URL || '';

export const environment = {
  production: true,
  apiBaseUrl,
};
