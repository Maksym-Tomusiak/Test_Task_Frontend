import { HttpClient } from '../lib/http/HttpClient';
import type { Captcha } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class CaptchaService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ baseURL: API_BASE_URL });
  }

  async getCaptcha(): Promise<Captcha> {
    return this.httpClient.get('/api/captcha');
  }
}

export const captchaService = new CaptchaService();
