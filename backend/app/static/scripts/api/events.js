import { apiFetch } from '../api/api.js';

export function getEvents() {
    return apiFetch('/events/');
}

export async function createEvent(formData) {
  const res = await fetch("/api/events", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create event");
  }

  return res.json();
}

export function deleteEvents(eventId){
    return apiFetch(`/events/${eventId}`, {
        method: "DELETE",
    })
}