import { apiFetch } from '../api/api.js';

export function getEvents() {
    return apiFetch('/events/');
}

export async function createEvent(formData) {
  const response = await fetch("/api/events/", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create event");
  }
  
  return response.json();
}

export function deleteEvents(eventId){
    return apiFetch(`/events/${eventId}`, {
        method: "DELETE",
    })
}