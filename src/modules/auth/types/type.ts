export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginPayload {
  email: string;
  password?: string;
}

export interface AdminAuthResponseData {
  accessToken: string;
  refreshToken?: string;
  user: AdminUser;
}
