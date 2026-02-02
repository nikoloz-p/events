import { apiFetch } from "../api/api.js";

const form = document.getElementById("auth_form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    await apiFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    window.location.href = "/";
  } catch (err) {
    alert("Invalid email or password");
  }
}); 