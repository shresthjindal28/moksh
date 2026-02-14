import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("moksh_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set Content-Type (with boundary) for FormData so multipart uploads work
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error?: { message?: string } }>) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("moksh_admin_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export function getApiUrl(path: string): string {
  return `${baseURL}${path}`;
}
