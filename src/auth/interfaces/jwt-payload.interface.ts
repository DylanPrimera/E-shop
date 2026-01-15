export interface JwtPayload {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}
