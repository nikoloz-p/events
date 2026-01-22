// API CALL

const API_BASE = 'http://127.0.0.1:8000';

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "API error");
    }

    return res.json();
}