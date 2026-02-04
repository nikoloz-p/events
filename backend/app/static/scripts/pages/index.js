import { getEvents, deleteEvents } from '../api/events.js';
import { initI18n, loadLanguage, t, translatePage } from '../../js/i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initI18n();
    await loadEvents();
});

document.getElementById("en_btn")?.addEventListener("click", () => {
    loadLanguage("en");
});

document.getElementById("ge_btn")?.addEventListener("click", () => {
    loadLanguage("ka");
});

document.addEventListener("languageChanged", () => {
    loadEvents();
});

const eventsContainer = document.getElementById('events');

async function loadEvents() {
    if (!eventsContainer) return;

    try {
        const events = await getEvents('/events/');
        renderEvents(events);
        translatePage(eventsContainer);
    } catch {
        eventsContainer.innerHTML = `
            <p class="error">${t("errors.events_not_found")}</p>
        `;
    }
}

function renderEvents(events) {
    eventsContainer.innerHTML = '';

    const locale = localStorage.getItem("lang") === "ka" ? "ka-GE" : "en-US";

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';

        const imageHtml = event.image_url
            ? `<img src="${event.image_url}" alt="${event.title}" class="event_image"/>`
            : '';

        const dateObj = new Date(event.datetime);
        const eventDate = dateObj.toLocaleDateString(locale).replaceAll('/', '.');
        const eventTime = dateObj.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit"
        });

        eventElement.innerHTML = `
            <div class="event_main">
                <h2 class="event_title">${event.title}</h2>
                <h4 class="event_date">${eventDate}</h4>
                <h4 class="event_time">${eventTime}</h4>
            </div>
            <div class="event_details">
                ${imageHtml}
                <ul class="events_list">
                    <li class="events_list_item"><span data-i18n="event.city"></span> ${event.city}</li>
                    <li class="events_list_item">
                        <span data-i18n="event.venue"></span>
                        <a href="${event.venue}" class="event_venue_link" target="_blank">Link</a>
                    </li>
                    <li class="events_list_item"><span data-i18n="event.performers"></span> ${event.performers}</li>
                    <li class="events_list_item event_description">
                        <span data-i18n="event.description"></span>
                        ${event.description || t("event.no_description")}
                    </li>
                </ul>
            </div>
        `;

        if (window.IS_ADMIN) {
            const controls = document.createElement('div');
            controls.innerHTML = `
                <button class="event_remove_btn btn">X</button>
                <button class="event_edit_btn btn" data-id="${event.id}">Edit</button>
            `;
            eventElement.querySelector('.event_details').appendChild(controls);

            controls.querySelector('.event_remove_btn').onclick = async () => {
                await deleteEvents(event.id);
                loadEvents();
            };

            controls.querySelector('.event_edit_btn').onclick = e => {
                window.location.href = `/events/${e.target.dataset.id}/edit`;
            };
        }

        eventsContainer.appendChild(eventElement);
    });
}