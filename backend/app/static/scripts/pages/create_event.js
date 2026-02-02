import { createEvent } from '../api/events.js';

const addEventForm = document.getElementById('add_event_form');

addEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addEventForm);


    const rawDate = document.getElementById('event_date').value;
    formData.set('datetime', new Date(rawDate).toISOString());

    try {
        await createEvent(formData);

        alert("ივენთი წარმატებით დაემატა!");
        addEventForm.reset();
        window.location.href = '/';
    } catch (error) {
        console.error("შეცდომა ივენთის დამატებისას:", error);
        alert(error.message);
    }
});