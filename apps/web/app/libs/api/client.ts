/**
 * Custom error class for API requests that preserves HTTP status codes and response details.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Central API client for making authenticated requests to the backend.
 * Automatically handles JSON content-type and Bearer token authentication.
 *
 * @throws {ApiError} When the response is not ok, includes status code and error details
 */
export async function apiClient<T>(
  endpoint: string,
  { accessToken, ...options }: RequestInit & { accessToken?: string }
): Promise<T> {
  const response = await fetch(
    import.meta.env.VITE_API_URL + endpoint,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    let errorMessage = response.statusText;
    let errorData;

    try {
      errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Response body is not JSON, use statusText
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  return response.json() as Promise<T>;
}

