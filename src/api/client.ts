import type { TokenMillSDK } from "../sdk";

export const API_ENDPOINTS = {
  MAIN: "https://api.tokenmill.xyz",
  BARN: "https://sol-barn.tokenmill.xyz",
} as const;

export interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  requiresAuth?: boolean;
}

export class ApiClient {
  constructor(private sdk: TokenMillSDK) {}

  private validateApiKey(): void {
    if (!this.sdk.apiKey) {
      throw new Error("This method requires an API key");
    }
  }

  private getDefaultHeaders(requiresAuth: boolean = false, accessToken?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.sdk.apiKey) {
      headers["x-tokenmill-api-key"] = this.sdk.apiKey;
    }

    if (requiresAuth && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  private getBarnHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "referer": "https://tokenmill.xyz",
    };
  }

  async request<T>(
    url: string, 
    options: ApiRequestOptions = {},
    accessToken?: string
  ): Promise<T> {
    if (options.requiresAuth !== false) {
      this.validateApiKey();
    }

    const isBarnRequest = url.includes(API_ENDPOINTS.BARN);
    const defaultHeaders = isBarnRequest 
      ? this.getBarnHeaders()
      : this.getDefaultHeaders(options.requiresAuth, accessToken);

    const response = await Bun.fetch(url, {
      method: options.method || "GET",
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      body: options.body,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json() as T;
  }

  async requestMain<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    accessToken?: string
  ): Promise<T> {
    const url = `${API_ENDPOINTS.MAIN}${endpoint}`;
    return this.request<T>(url, options, accessToken);
  }

  async requestBarn<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = `${API_ENDPOINTS.BARN}${endpoint}`;
    return this.request<T>(url, { ...options, requiresAuth: false });
  }
}