import { HttpClient } from '../lib/http/HttpClient';
import type {
  User,
  RegisterUserDto,
  LoginUserDto,
  TokenResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class UserService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ baseURL: API_BASE_URL });
  }

  async register(data: RegisterUserDto): Promise<User> {
    return this.httpClient.post('/api/users/register', data);
  }

  async login(data: LoginUserDto): Promise<TokenResponse> {
    return this.httpClient.post('/api/users/login', data);
  }

  async restore(): Promise<User> {
    return this.httpClient.post('/api/users/restore', {});
  }

  async getCurrentUser(): Promise<User> {
    return this.httpClient.get('/api/users/me');
  }

  async deleteCurrentUser(): Promise<{ message: string }> {
    return this.httpClient.delete('/api/users/me');
  }
}

export const userService = new UserService();
