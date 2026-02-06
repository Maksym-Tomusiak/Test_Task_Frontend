export interface User {
  id: string;
  username: string;
  email: string;
  isDeleted: boolean;
}

export interface RegisterUserDto {
  inviteCode: string;
  email: string;
  password: string;
  username: string;
  captchaId: string;
  captchaCode: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
