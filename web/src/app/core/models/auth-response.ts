/**
 * Response model for authentication endpoints
 */
export interface AuthResponse {
  accessToken: string;
  usu_email: string;
  usu_name: string;
  usu_id: number;
  usu_role: string;
  message: string;
}

/**
 * Cached user context information
 */
export interface UserContext {
  token: string;
  email: string;
  name: string;
  userId: number;
  role: string;
}
