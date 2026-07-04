// Custom lightweight Fetch wrapper that mimics the Axios interface
// to prevent package dependency bloat while matching the requested file structure.

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  data?: any;
}

const getHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("hrms_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const buildUrl = (url: string, params?: Record<string, string | number | boolean | undefined>): string => {
  if (!params) return url;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const axiosInstance = {
  get: async <T>(url: string, config?: RequestConfig): Promise<{ data: T }> => {
    const fullUrl = buildUrl(url, config?.params);
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: getHeaders(),
      ...config,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `GET Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return { data };
  },

  post: async <T>(url: string, data?: any, config?: RequestConfig): Promise<{ data: T }> => {
    const fullUrl = buildUrl(url, config?.params);
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `POST Request failed with status ${response.status}`);
    }
    const resData = await response.json();
    return { data: resData };
  },

  put: async <T>(url: string, data?: any, config?: RequestConfig): Promise<{ data: T }> => {
    const fullUrl = buildUrl(url, config?.params);
    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `PUT Request failed with status ${response.status}`);
    }
    const resData = await response.json();
    return { data: resData };
  },

  delete: async <T>(url: string, config?: RequestConfig): Promise<{ data: T }> => {
    const fullUrl = buildUrl(url, config?.params);
    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers: getHeaders(),
      ...config,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `DELETE Request failed with status ${response.status}`);
    }
    const resData = await response.json();
    return { data: resData };
  }
};

export default axiosInstance;
