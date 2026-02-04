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

        const eventDate = new Date(event.datetime).toLocaleString().replaceAll("/", ".").split(",")[0];
        const eventTime = new Date(event.datetime).toLocaleString().split(",")[1].trim().split(":").slice(0,2).join(":");

        console.log(eventTime);

        eventElement.innerHTML = `
            <div class="event_main">
                <h2 class="event_title">${event.title}</h2>
                <h4 class="event_date">
                    ${eventDate}
                </h4>
                <h4 class="event_time">
                    ${eventTime}
                </h4>
                ${imageHtml}
            </div>
            <div class="event_details">
                <ul class="events_list">
                    <li class="events_list_item"><span>ქალაქი:</span> ${event.city}</li>
                    <li class="events_list_item event_venue_link_item"><span>მდებარეობა:</span> <a href="${event.venue}" target="_blank" class="event_venue_link">ლინკი</a></li>
                    <li class="events_list_item"><span>შემსრულებლები:</span> ${event.performers}</li>
                    <li class="events_list_item"><span>აღწერა:</span> ${event.description || 'აღწერა არ არის მოცემული'}</li>
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


// nav

const burgerIcon = document.getElementById('burger_menu');
const navMenu = document.getElementById('header_nav');
const overlay = document.getElementById('overlay');
const closeIcon = document.getElementById('close_icon');

burgerIcon.addEventListener('click', () => {
    navMenu.classList.toggle('nav_visible');
    overlay.classList.toggle('overlay_visible');
    closeIcon.classList.toggle('close_icon_visible');

});

closeIcon.addEventListener('click', () => {
    navMenu.classList.remove('nav_visible');
    overlay.classList.remove('overlay_visible');
    closeIcon.classList.remove('close_icon_visible');
});