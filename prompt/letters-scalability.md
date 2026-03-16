Update letters API for Scalability

The current single-endpoint approach will not scale and is likely to crash.

The Problem
The current /api/letters endpoint sends the entire database of letters in one request. This is inefficient for two distinct frontend needs:

The Globe: Needs all marker locations at once, but not the letter content.
The Letter Feed/Modal: Needs the full content, but only for one letter at a time (or a small group, let's set the default to 20 letters for now).
The Solution: A Three-Endpoint Architecture
This separates the concerns, ensuring a fast and scalable experience.

1. Endpoint for Globe Markers
This endpoint loads all the data the globe needs to render its pins, and nothing more. It will be very fast.

URL: /api/letters/markers
Method: GET
Purpose: Provide a lightweight array of all letter locations and their IDs.
Example Response:
[
  { "id": "uuid-1", "lat": -25.42, "lng": -49.26 },
  { "id": "uuid-2", "lat": -23.55, "lng": -46.63 }
]

2. Endpoint for a Single Letter
This dynamic endpoint is called only when a user clicks a marker on the globe.

URL: /api/letters/[id]
Method: GET
Purpose: Fetch the full content of a single letter by its ID for display in a modal.
Example Response:
{
  "id": "uuid-2",
  "content": "Todos os dias te crio uma carta...",
  "author": null,
  "city": "São Paulo, SP, Brasil"
}

3. Endpoint for the Letter Feed (Paginated)
This modifies the existing endpoint to serve letters in manageable chunks.

URL: /api/letters?page=1&limit=20
Method: GET
Purpose: Efficiently load the main letter feed for users who want to scroll through all the messages.
Suggestion: Can we get those letters randomized on each request to keep the feed fresh?

User Interaction Flow
Page Load: The frontend calls /api/letters/markers once to draw all the pins on the globe.
User Click: User clicks a pin. The frontend grabs the id associated with that pin.
Modal Display: The frontend calls /api/letters/[id] with the specific ID and uses the response to populate the modal with the letters content.
This strategy ensures a fast initial load, fetches data only when needed, and will scale gracefully with the expected traffic.

Since we're going for that click to grab maker data, let's ditch the hover effect on the globe for now to keep things simple. Let's just display the pins and have users click to see the letters.
