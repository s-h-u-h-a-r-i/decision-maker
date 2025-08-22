import { Axios, AxiosRequestConfig } from "axios";

import { env } from "../../configs";
import { authService, AuthService } from "../auth/services";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type RequestConfig = Pick<AxiosRequestConfig, "headers">;

class ApiService {
  #client;
  #authService;

  constructor(baseURL: string, authService: AuthService) {
    this.#client = new Axios({
      baseURL,
    });
    this.#authService = authService;
  }

  async get<T>(
    endpoint: string,
    options?: {
      config?: RequestConfig;
      authenticate?: boolean;
    },
  ): Promise<ApiResponse<T>> {
    try {
      const config = await this.#prepareRequestConfig(
        options?.config,
        options?.authenticate,
      );
      const response = await this.#client.get<ApiResponse<T>>(endpoint, config);
      return response.data;
    } catch (error) {
      return this.#handleError("Error occurred while fetching data", error);
    }
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: {
      config?: RequestConfig;
      authenticate?: boolean;
    },
  ): Promise<ApiResponse<T>> {
    try {
      const config = await this.#prepareRequestConfig(
        options?.config,
        options?.authenticate,
      );
      const response = await this.#client.post<ApiResponse<T>>(
        endpoint,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      return this.#handleError("Error occurred while posting data", error);
    }
  }

  async delete<T>(
    endpoint: string,
    options?: {
      config?: RequestConfig;
      authenticate?: boolean;
    },
  ): Promise<ApiResponse<T>> {
    try {
      const config = await this.#prepareRequestConfig(
        options?.config,
        options?.authenticate,
      );
      const response = await this.#client.delete<ApiResponse<T>>(
        endpoint,
        config,
      );
      return response.data;
    } catch (error) {
      return this.#handleError("Error occurred while deleting data", error);
    }
  }

  async #prepareRequestConfig(
    baseConfig?: RequestConfig,
    authenticate: boolean = false,
  ): Promise<RequestConfig> {
    const config: RequestConfig = {
      headers: {
        "Content-Type": "application/json",
        ...baseConfig?.headers,
      },
    };

    if (authenticate) {
      const token = await this.#authService.getIdToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  }

  #handleError<T>(message: string, error: unknown): ApiErrorResponse {
    return {
      success: false,
      message,
      errors: [
        error instanceof Error ? error.message : "Uknown error occurred",
      ],
    };
  }
}

export const apiService = new ApiService(env.baseApiUrl, authService);
export type { ApiService };
