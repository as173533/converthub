const API_URL = "/api";

export function token() {
  return localStorage.getItem("converthub_token");
}

export function setSession(value, user) {
  localStorage.setItem("converthub_token", value);
  localStorage.setItem("converthub_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("converthub_token");
  localStorage.removeItem("converthub_user");
}

export function storedUser() {
  const raw = localStorage.getItem("converthub_user");
  return raw ? JSON.parse(raw) : null;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (token()) headers.set("Authorization", `Bearer ${token()}`);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    const message = payload.message || Object.values(payload.errors || {})?.[0]?.[0] || "Request failed";
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  profile: () => request("/auth/profile"),
  dashboard: () => request("/dashboard"),
  tools: () => request("/tools"),
  conversions: () => request("/conversions"),
  upload: (tool, file, options = {}) => {
    const form = new FormData();
    form.set("tool", tool);
    form.set("file", file);
    Object.entries(options).forEach(([key, value]) => form.set(`options[${key}]`, value));
    return request("/conversions", { method: "POST", body: form });
  },
  pdfEditor: (file, operations) => {
    const form = new FormData();
    form.set("file", file);
    operations.forEach((operation, index) => {
      Object.entries(operation).forEach(([key, value]) => form.set(`operations[${index}][${key}]`, value));
    });
    return request("/pdf-editor", { method: "POST", body: form });
  },
  deleteConversion: (id) => request(`/conversions/${id}`, { method: "DELETE" }),
  download: async (job) => {
    const response = await fetch(`${API_URL}/conversions/${job.id}/download`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${job.original_filename}-converted`;
    anchor.click();
    URL.revokeObjectURL(url);
  },
  adminStats: () => request("/admin/stats"),
  adminUsers: () => request("/admin/users"),
  adminJobs: () => request("/admin/jobs"),
  failedJobs: () => request("/admin/failed-jobs")
};

