const pathParts = window.location.pathname.split("/");
const eventId = pathParts[2];

if (!eventId) {
  console.error("Event ID not found in URL");
}

const editEventForm = document.getElementById("edit_event_form");

const title = document.getElementById("event_name");
const city = document.getElementById("event_city");
const venue = document.getElementById("event_venue");
const performers = document.getElementById("event_performers");
const date = document.getElementById("event_date");

async function loadEvent() {
  const res = await fetch(`/events/${eventId}`);
  if (!res.ok) {
    console.error("Failed to load event");
    return;
  }

  const event = await res.json();

  title.value = event.title;
  city.value = event.city;
  venue.value = event.venue;
  performers.value = event.performers;
  date.value = event.datetime.slice(0, 16);
}

loadEvent();

editEventForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedEvent = {
    title: title.value,
    city: city.value,
    venue: venue.value,
    performers: performers.value,
    datetime: date.value,
  };

  await fetch(`/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEvent),
  });

  window.location.href = "/";
});