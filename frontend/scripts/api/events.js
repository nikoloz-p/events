import { apiFetch } from '../api/api.js';

export function getEvents() {
    return apiFetch('/events/');
}

export function createEvent(event) {
    return apiFetch('/events/', {
        method: "POST",
        body: JSON.stringify(event),
    });
}   

export function deleteEvents(eventId){
    return apiFetch(`/events/${eventId}`, {
        method: "DELETE",
    })
}