import { createEvent } from '../api/events.js';


const eventName = document.getElementById('event_name');
const eventCity = document.getElementById('event_city');
const eventVenue = document.getElementById('event_venue');
const eventPerformers = document.getElementById('event_performers');
const eventDate = document.getElementById('event_date');
const addEventForm = document.getElementById('add_event_form');

addEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const event = {
        title: eventName.value,
        city: eventCity.value,
        venue: eventVenue.value,
        performers: eventPerformers.value,
        datetime: new Date(eventDate.value).toISOString(),
    };

    try {
        await createEvent(event);
        alert("ივენთი წარმატებით დაემატა!");
        addEventForm.reset();

        window.location.href = '/';
    } catch (error) {
        console.error("შეცდომა ივენთის დამატებისას:", error);
        alert(error.message);
    }
}); 