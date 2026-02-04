const DEFAULT_API_URL = "http://10.1.9.160:5000";

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

const buildUrl = (path) => `${API_URL}${path}`;

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      payload?.error || payload?.message || "Error en la solicitud.";
    throw new Error(message);
  }

  return payload;
};

export const api = {
  login: (data) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getActivos: () => request("/activos"),
  createActivo: (data) =>
    request("/activos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateActivo: (id, data) =>
    request(`/activos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteActivo: (id) =>
    request(`/activos/${id}`, {
      method: "DELETE",
    }),
  getMantenimientos: () => request("/mantenimientos"),
  createMantenimiento: (data) =>
    request("/mantenimientos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateMantenimiento: (id, data) =>
    request(`/mantenimientos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteMantenimiento: (id) =>
    request(`/mantenimientos/${id}`, {
      method: "DELETE",
    }),
};
