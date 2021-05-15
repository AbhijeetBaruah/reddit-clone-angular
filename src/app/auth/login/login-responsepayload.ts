export interface LoginResponse{
  authenticationToken: string;
  expiresAt: Date;
  refreshToken: string;
  username: string;
}