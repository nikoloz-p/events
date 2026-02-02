const API_BASE = (() => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}/api`;
})();

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    let message = "Token expired";

    try {
      const data = await res.json();
      if (data?.detail) message = data.detail;
    } catch {}

    alert(message);

    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API error");
  }

  return res.json();
}