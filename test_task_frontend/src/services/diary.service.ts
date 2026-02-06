import { HttpClient } from '../lib/http/HttpClient';
import type {
  DiaryEntry,
  CreateDiaryEntryDto,
  UpdateDiaryEntryDto,
  PaginatedDiaryEntries,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class DiaryService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ baseURL: API_BASE_URL });
  }

  async getAll(
    pageNumber: number = 1,
    pageSize: number = 5,
    searchTerm?: string,
    startDate?: string,
    endDate?: string
  ): Promise<PaginatedDiaryEntries> {
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());
    if (searchTerm) {
      params.append('searchTerm', searchTerm);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    return this.httpClient.get(`/api/diary-entries?${params.toString()}`);
  }

  async getById(id: string): Promise<DiaryEntry> {
    return this.httpClient.get(`/api/diary-entries/${id}`);
  }

  async create(data: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const formData = new FormData();
    formData.append('content', data.content);

    if (data.image) {
      formData.append('image', data.image);
    }

    return this.httpClient.post('/api/diary-entries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async update(id: string, data: UpdateDiaryEntryDto): Promise<DiaryEntry> {
    const formData = new FormData();
    formData.append('content', data.content);

    if (data.image) {
      formData.append('image', data.image);
    }

    if (data.deleteCurrentImage) {
      formData.append('deleteCurrentImage', 'true');
    }

    return this.httpClient.put(`/api/diary-entries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.httpClient.delete(`/api/diary-entries/${id}`);
  }

  async getEntryImage(id: string): Promise<Blob> {
    const response = await this.httpClient.request<Blob>({
      url: `/api/entry-images/${id}`,
      method: 'GET',
      responseType: 'blob',
    });
    return response;
  }

  getImageUrl(id: string): string {
    return `${API_BASE_URL}/api/entry-images/${id}`;
  }
}

export const diaryService = new DiaryService();
