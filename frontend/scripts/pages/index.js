import { getEvents, deleteEvents } from '../api/events.js';

// get events

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

// render events

function renderEvents(events) {
    eventsContainer.innerHTML = '';

    console.log(events);


    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.innerHTML = `
            <h2 class="event_title"><a href="event_details.html?id=${event.id}">${event.title}</a></h2>
            <ul class="events_list">
                <li class="events_list_item">
                    <span>ქალაქი: </span>${event.city}
                </li>
                <li class="events_list_item">
                    <span>მდებარეობა: </span><a href="${event.venue}">${event.venue}</a>
                </li>
                <li class="events_list_item">
                    <span>შემსრულებლები: </span>${event.performers}
                </li>
                <li class="events_list_item">
                    <span>თარიღი: </span>${new Date(event.datetime).toLocaleString()}
                </li>
            </ul>
            <button class="event_remove_btn">წაშლა</button>
        `;

        // delete events

        const removeEventBtn = eventElement.querySelector('.event_remove_btn');

        removeEventBtn.addEventListener('click', async () => {
            console.log(event.id);
            try {
                await deleteEvents(event.id);
                alert("ივენთი წარმატებით წაიშალა!");
                window.location.reload();
            } catch (error) {
                console.error("შეცდომა ივენთის წაშლისას:", error);
                alert(error.message);
            }
        });


        eventsContainer.appendChild(eventElement);
    });
}




loadEvents();