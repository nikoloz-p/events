import { apiFetch } from '../api/api.js';

export function getEvents() {
    return apiFetch('/events/');
}

export function createEvent(formData) {
  return fetch("/api/events/", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}

export function deleteEvents(eventId){
    return apiFetch(`/events/${eventId}`, {
        method: "DELETE",
    })
}