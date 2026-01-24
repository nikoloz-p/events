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

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';

        let adminControls = '';
        if (window.IS_ADMIN) {
            adminControls = `<button class="event_remove_btn btn">წაშლა</button>
              <button class="event_edit_btn btn" data-id="${event.id}">რედაქტირება</button>`;
        }

        eventElement.innerHTML = `
            <h2 class="event_title">${event.title}</h2>
            <ul class="events_list">
                <li><span>ქალაქი:</span> ${event.city}</li>
                <li><span>მდებარეობა:</span> <a href="${event.venue}" target="_blank">${event.venue}</a></li>
                <li><span>შემსრულებლები:</span> ${event.performers}</li>
                <li><span>თარიღი:</span> ${new Date(event.datetime).toLocaleString()}</li>
            </ul>
            ${adminControls}
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


document.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    window.location.href = `/events/${id}/edit`;
  }
});



loadEvents()