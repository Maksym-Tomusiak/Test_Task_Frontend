import { HttpClient } from '../lib/http/HttpClient';
import type { Invite, CreateInviteDto, PaginatedResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class InviteService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ baseURL: API_BASE_URL });
  }

  async create(data: CreateInviteDto): Promise<{ message: string }> {
    return this.httpClient.post('/api/invites', data);
  }

  async getAll(
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResult<Invite>> {
    return this.httpClient.get(
      `/api/invites?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  async getByCode(code: string): Promise<Invite> {
    return this.httpClient.get(`/api/invites/${code}`);
  }
}

export const inviteService = new InviteService();
