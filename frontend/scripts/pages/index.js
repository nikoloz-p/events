import { getEvents } from '../api/api.js';

// elements

const eventsContainer = document.getElementById('events');

async function loadEvents() {
    try {
        const events = await getEvents('/events/');
        renderEvents(events);

    } catch (error) {
        console.error("Error loading events:", error);
        eventsContainer.innerHTML = `<p class="error">Failed to load events: ${error.message}</p>`;
    }
};

function renderEvents(events) {
    eventsContainer.innerHTML = '';

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.innerHTML = `
            <h2 class="event_title"><a href="event_details.html?id=${event.id}">${event.title}</a></h2>
            <p class="event_city">City: ${event.city}</p>
            <p class="event_venue">Venue: ${event.venue}</p>
            <p class="event_performers">Performers: ${event.performers}</p>
            <p class="event_datetime">Date: ${new Date(event.datetime).toLocaleString()}</p>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

loadEvents();

