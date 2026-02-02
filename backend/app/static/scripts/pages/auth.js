import { apiFetch } from "../api/api.js";

const form = document.getElementById("auth_form");
const logoutBtn = document.getElementById("logout_btn");

if (form != null) {
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
      alert("არასწორი პარამეტრები");
    }
  }); 
}

if (logoutBtn != null) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });

      window.location.href = "/";
    } catch (err) {
      console.error("შეცდომა:", err);
      alert("შეცდომა გამოსვლისას");
    }
  });
}