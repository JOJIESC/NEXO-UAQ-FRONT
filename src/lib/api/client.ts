import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexo-uaq-back.vercel.app';

interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async getAuthToken(): Promise<string | null> {
        if (typeof window !== 'undefined') return null;
        try {
            const cookieStore = await cookies();
            return cookieStore.get('access_token')?.value || null;
        } catch {
            return null;
        }
    }

    private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
        const url = new URL(endpoint, this.baseURL);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }

        return url.toString();
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        if (!response.ok) {
            let errorData;

            try {
                errorData = isJson ? await response.json() : await response.text();
            } catch {
                errorData = { message: 'Error parsing response' };
            }

            const errorMessage =
                errorData?.message ||
                errorData?.error ||
                (typeof errorData === 'string' ? errorData : null) ||
                `Error ${response.status}: ${response.statusText}`;

            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return {} as T;
        }

        if (isJson) {
            return await response.json() as Promise<T>;
        }

        return await response.text() as unknown as Promise<T>;
    }

    async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<T> {
        const { params, headers, ...restConfig } = config;
        const url = this.buildURL(endpoint, params);
        const token = await this.getAuthToken();

        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        };

        try {
            const response = await fetch(url, {
                ...restConfig,
                headers: defaultHeaders,
                cache: restConfig.cache || 'no-store',
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error('API Request Error:', error.message);
                throw error;
            }
            throw new Error('Unknown API error');
        }
    }

    async get<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean>,
        options?: Omit<RequestConfig, 'params'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            params,
            ...options,
        });
    }

    async post<T>(endpoint: string, data?: unknown, options?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
    }

    async put<T>(endpoint: string, data?: unknown, options?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
        });
    }

    async patch<T>(endpoint: string, data?: unknown, options?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            ...options,
        });
    }

    async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }

    async getServer<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean>,
        cacheOptions?: { revalidate?: number | false; tags?: string[] }
    ): Promise<T> {
        const isNoCache = cacheOptions?.revalidate === false;

        return this.request<T>(endpoint, {
            method: 'GET',
            params,
            cache: isNoCache ? 'no-store' : 'force-cache',
            next: {
                revalidate: isNoCache ? undefined : cacheOptions?.revalidate,
                tags: cacheOptions?.tags,
            },
        });
    }

    async postServer<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
        });
    }

    async patchServer<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            cache: 'no-store',
        });
    }

    async deleteServer<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            cache: 'no-store',
        });
    }

    async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        const token = await this.getAuthToken();
        const url = this.buildURL(endpoint);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formData,
                cache: 'no-store',
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error('API FormData Request Error:', error.message);
                throw error;
            }
            throw new Error('Unknown FormData upload error');
        }
    }
}

export const apiClient = new ApiClient(BASE_URL);

export default ApiClient;
