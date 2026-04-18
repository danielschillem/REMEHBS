import { describe, it, expect, vi, beforeEach } from "vitest";

type RequestConfig = {
  headers: Record<string, string>;
  _retry?: boolean;
};

type ResponseLike = { data: unknown };

type ErrorLike = {
  response?: { status?: number };
  config?: RequestConfig;
};

type MockAxiosInstance = {
  defaults: { baseURL: string };
  interceptors: {
    request: {
      use: (fn: (config: RequestConfig) => RequestConfig) => void;
    };
    response: {
      use: (
        successFn: (response: ResponseLike) => ResponseLike,
        errorFn: (error: ErrorLike) => Promise<never>,
      ) => void;
    };
  };
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("API client interceptors", () => {
  let requestInterceptor: (config: RequestConfig) => RequestConfig;
  let responseSuccessInterceptor: (r: ResponseLike) => ResponseLike;
  let responseErrorInterceptor: (error: ErrorLike) => Promise<never>;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();

    // Capture interceptors by mocking axios.create
    const mockInstance: MockAxiosInstance = {
      defaults: { baseURL: "http://localhost:8000/api" },
      interceptors: {
        request: {
          use: vi.fn((fn: (config: RequestConfig) => RequestConfig) => {
            requestInterceptor = fn;
          }),
        },
        response: {
          use: vi.fn(
            (
              successFn: (response: ResponseLike) => ResponseLike,
              errorFn: (error: ErrorLike) => Promise<never>,
            ) => {
              responseSuccessInterceptor = successFn;
              responseErrorInterceptor = errorFn;
            },
          ),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    vi.doMock("axios", () => ({
      default: {
        create: vi.fn(() => mockInstance),
        post: vi.fn(),
      },
    }));

    // Import triggers interceptor registration
    await import("../api/client");
  });

  it("request interceptor adds auth header when token present", () => {
    localStorage.setItem("access_token", "my-jwt-token");
    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe("Bearer my-jwt-token");
  });

  it("request interceptor does not add auth header when no token", () => {
    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it("response success interceptor passes through", () => {
    const response = { data: { ok: true } };
    expect(responseSuccessInterceptor(response)).toBe(response);
  });

  it("response error interceptor rejects non-401 errors", async () => {
    const error = {
      response: { status: 500 },
      config: { headers: {} as Record<string, string> },
    };
    await expect(responseErrorInterceptor(error)).rejects.toBe(error);
  });

  it("response error interceptor attempts refresh on 401", async () => {
    localStorage.setItem("refresh_token", "my-refresh");
    const axios = (await import("axios")).default;

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { access: "new-access-token" },
    });

    const originalConfig = {
      _retry: false,
      headers: {} as Record<string, string>,
    };
    const error = { response: { status: 401 }, config: originalConfig };

    // The interceptor will call the mock instance to retry
    // Since mock instance methods aren't set up for retry, we just test the refresh call
    try {
      await responseErrorInterceptor(error);
    } catch {
      // Expected - retry will fail because mock api() isn't a function
    }

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8000/api/auth/refresh/",
      { refresh: "my-refresh" },
    );
  });

  it("response error interceptor clears storage on refresh failure", async () => {
    localStorage.setItem("refresh_token", "bad-refresh");
    localStorage.setItem("access_token", "old-token");
    const axios = (await import("axios")).default;

    vi.mocked(axios.post).mockRejectedValueOnce(new Error("refresh failed"));

    // Mock window.location.href
    const originalHref = window.location.href;
    Object.defineProperty(window, "location", {
      value: { href: originalHref },
      writable: true,
    });

    const originalConfig = {
      _retry: false,
      headers: {} as Record<string, string>,
    };
    const error = { response: { status: 401 }, config: originalConfig };

    try {
      await responseErrorInterceptor(error);
    } catch {
      // Expected
    }

    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
