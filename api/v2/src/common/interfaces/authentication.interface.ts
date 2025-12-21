/**
 * Authentication Strategy Interface - Strategy Pattern + Interface Segregation
 * Allows different authentication methods without modifying existing code
 */
export interface IAuthenticationStrategy {
  authenticate(credentials: any): Promise<{ accessToken: string; user: any }>;
  validate(token: string): Promise<any>;
}
