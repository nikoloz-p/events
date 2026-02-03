const pathParts = window.location.pathname.split("/");
const eventId = pathParts[2];

console.log("Editing event with ID:", eventId, pathParts);

if (!eventId) {
  console.error("Event ID not found in URL");
}

const editEventForm = document.getElementById("edit_event_form");

const title = document.getElementById("event_name");
const city = document.getElementById("event_city");
const venue = document.getElementById("event_venue");
const performers = document.getElementById("event_performers");
const date = document.getElementById("event_date");
const image = document.getElementById("event_image");

async function loadEvent() {
  const res = await fetch(`/api/events/${eventId}`)

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
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("city", city.value);
  formData.append("venue", venue.value);
  formData.append("performers", performers.value);
  formData.append("datetime", date.value);

  if (image.files && image.files[0]) {
    formData.append("image", image.files[0]);
  }

  const res = await fetch(`/api/events/${eventId}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    console.error("Failed to update event");
    return;
  }

  window.location.href = "/";
});