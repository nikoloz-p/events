const API_BASE = "https://web-production-4a553.up.railway.app/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // IMPORTANT for cookies
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

    // redirect to login
    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API error");
  }

  return res.json();
}