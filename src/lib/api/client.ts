
import { cookies } from 'next/headers';

const BASE_URL = 'http://localhost:3000';

interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean>;
    isServer?: boolean;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async getAuthToken(isServer?: boolean): Promise<string | null> {
        // En el servidor (Server Components)
        if (isServer && typeof window === 'undefined') {
            try {
                const cookieStore = await cookies();
                const token = cookieStore.get('access_token')?.value || null;
                return token;
            } catch (error) {
                console.error('Error reading server cookies:', error);
                return null;
            }
        }

        // En el cliente (Client Components)
        if (typeof window !== 'undefined') {
            // Primero intentar desde cookies
            const cookieToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];

            if (cookieToken) return cookieToken;

            // Fallback a localStorage
            return localStorage.getItem('access_token');
        }

        return null;
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
            } catch (e) {
                errorData = { message: 'Error parsing response' };
            }

            // Manejo específico de errores
            if (response.status === 401) {
                // Token expirado o inválido - solo en cliente
                if (typeof window !== 'undefined') {
                    // Limpiar tokens
                    localStorage.removeItem('access_token');
                    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                    // Redirigir al login
                    window.location.href = '/login?error=session_expired';
                }
            }

            const errorMessage =
                errorData?.message ||
                errorData?.error ||
                (typeof errorData === 'string' ? errorData : null) ||
                `Error ${response.status}: ${response.statusText}`;

            throw new Error(errorMessage);
        }

        // No content
        if (response.status === 204) {
            return {} as T;
        }

        // Retornar según el tipo de contenido
        if (isJson) {
            return await response.json() as Promise<T>;
        }

        // Si no es JSON, retornar el texto como tipo desconocido
        return await response.text() as unknown as Promise<T>;
    }

    async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<T> {
        const { params, headers, isServer, ...restConfig } = config;
        const url = this.buildURL(endpoint, params);
        const token = await this.getAuthToken(isServer);

        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        };

        try {
            const response = await fetch(url, {
                ...restConfig,
                headers: defaultHeaders,
                // Next.js específico: controlar caché
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

    // Métodos de conveniencia para CLIENT COMPONENTS
    async get<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean>,
        options?: Omit<RequestConfig, 'params'>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            params,
            ...options
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
            ...options
        });
    }

    // Métodos específicos para SERVER COMPONENTS (Server Actions)
// Métodos específicos para SERVER COMPONENTS (Server Actions)
    async getServer<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean>,
        cacheOptions?: { revalidate?: number | false; tags?: string[] }
    ): Promise<T> {
        // Determinamos si queremos desactivar el caché
        const isNoCache = cacheOptions?.revalidate === false;

        return this.request<T>(endpoint, {
            method: 'GET',
            params,
            isServer: true,
            // Si revalidate es false, usamos 'no-store', si no, 'force-cache'
            cache: isNoCache ? 'no-store' : 'force-cache',
            next: {
                // CORRECCIÓN: Si es 'no-store', NO debemos mandar 'revalidate: false'
                // Mandamos undefined para que 'cache: no-store' tome prioridad sin conflictos.
                revalidate: isNoCache ? undefined : cacheOptions?.revalidate,
                tags: cacheOptions?.tags,
            },
        });
    }

    async postServer<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            isServer: true,
            cache: 'no-store',
        });
    }

    async patchServer<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            isServer: true,
            cache: 'no-store',
        });
    }

    async deleteServer<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            isServer: true,
            cache: 'no-store',
        });
    }

    // Metodo para enviar FormData (archivos)
    async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        const token = await this.getAuthToken();
        const url = this.buildURL(endpoint);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    // No incluir Content-Type para FormData
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

    // Helper para guardar token después del login (solo cliente)
    saveToken(token: string): void {
        if (typeof window !== 'undefined') {
            // Guardar en localStorage
            localStorage.setItem('access_token', token);

            // Guardar en cookie (httpOnly: false para que sea accesible desde JS)
            // Max-age: 24 horas
            document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        }
    }

    // Helper para limpiar token (solo cliente)
    clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    // Helper para obtener token desde el cliente
    getClientToken(): string | null {
        if (typeof window !== 'undefined') {
            const cookieToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];

            return cookieToken || localStorage.getItem('access_token');
        }
        return null;
    }
}

// Exportar instancia singleton
export const apiClient = new ApiClient(BASE_URL);

// Exportar también la clase
export default ApiClient;