import { getEvents, deleteEvents } from '../api/events.js';

// get events

const eventsContainer = document.getElementById('events');

async function loadEvents() {
    try {
        const events = await getEvents('/events/');
        renderEvents(events);

    } catch (error) {
        console.error("Error loading events:", error);
        eventsContainer.innerHTML = `<p class="error">ივენთები ვერ მოიძებნა: ${error.message}</p>`;
    }
};

// render events



function renderEvents(events) {
    eventsContainer.innerHTML = '';

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';

        let adminControls = '';
        if (window.IS_ADMIN) {
            adminControls = `<button class="event_remove_btn btn">წაშლა</button>
              <button class="event_edit_btn btn" data-id="${event.id}">რედაქტირება</button>`;
        }

        const imageHtml = event.image_url
        ? `<img src="${event.image_url}" alt="${event.title}" class="event_image"/>`
        : '';

        eventElement.innerHTML = `
            <div class="event_image_container">
                ${imageHtml}
            </div>
            <div class="event_details">
                <h2 class="event_title">${event.title}</h2>
                <ul class="events_list">
                    <li class="events_list_item"><span>ქალაქი:</span> ${event.city}</li>
                    <li class="events_list_item"><span>მდებარეობა:</span> <a href="${event.venue}" target="_blank" class="event_venue_link">${event.venue}</a></li>
                    <li class="events_list_item"><span>შემსრულებლები:</span> ${event.performers}</li>
                    <li class="events_list_item"><span>თარიღი:</span> ${new Date(event.datetime).toLocaleString()}</li>
                </ul>
                ${adminControls}
            </div>
        `;

        if (window.IS_ADMIN) {
            const btn = eventElement.querySelector('.event_remove_btn');
            btn.addEventListener('click', async () => {
                try {
                    await deleteEvents(event.id);
                    window.location.reload();
                } catch (err) {
                    alert("წაშლა ვერ მოხერხდა");
                }
            });
        }

        eventsContainer.appendChild(eventElement);
    });
}


loadEvents();

if (window.IS_ADMIN) {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('event_edit_btn')) {
            const id = e.target.dataset.id;
            window.location.href = `/events/${id}/edit`;
        }
    });
}
