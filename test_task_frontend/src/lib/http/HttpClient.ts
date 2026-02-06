import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
} from 'axios';

interface HttpClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  [key: string]: any;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private signal?: AbortSignal;

  constructor(configs: HttpClientConfig, signal?: AbortSignal) {
    this.axiosInstance = axios.create({
      baseURL: configs.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...configs.headers,
      },
      withCredentials: true, // Enable sending cookies with requests
      ...configs,
    });

    this.signal = signal;

    this.initInterceptors();
  }

  async get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        ...config,
        signal: this.signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.info('Request was cancelled');
      } else if (error instanceof AxiosError) {
        console.error('Request failed with error', error.response?.statusText);
      } else if (error instanceof Error) {
        console.error('Unexpected error occurred', error.message);
      }
      return Promise.reject(error);
    }
  }

  private initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          const authHeader = `Bearer ${token}`;
          config.headers['Authorization'] = authHeader;
        }
        return config;
      },
      (error) => {
        console.error('Request failed with error', error);
        return Promise.reject(error);
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error(
            'Request failed with error:',
            error.response.status,
            error.response.data
          );
          if (error.response.status === 401) {
            console.error('Unauthorized request');
            if (!window.location.href.includes('/login')) {
              window.location.href =
                '/login?returnUrl=' + window.location.pathname;
            }
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else if (error instanceof Error) {
          console.error('Unexpected error occurred', error.message);
        }
        return Promise.reject(error);
      }
    );
  }
}
