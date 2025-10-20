# **App Name**: FuelWise

## Core Features:

- Real-Time Fuel Price Simulation: Simulate fetching real-time fuel prices based on the selected Indian state using mock API data. Users can override the auto-filled price.
- Fuel Cost Calculation: Calculate the total fuel needed and trip cost based on trip distance, vehicle efficiency, and fuel price.  Display the results clearly.
- Anonymous Authentication: Automatically sign in users anonymously using Firebase Authentication.
- Trip Data Persistence: Save trip data (distance, efficiency, state, price per liter, total cost, timestamp) to a Firestore collection named 'trips', associated with the user's UID.
- Trip History Display: Fetch and display the user's trip history from Firestore, ordered by timestamp (newest first).  Show the date, state, and total cost for each trip.
- Trip History Management: Allow users to clear their trip history by deleting all trip documents associated with their UID in Firestore.

## Style Guidelines:

- Primary color: Deep blue (#3B82F6) for a sense of trust and efficiency.
- Background color: Light gray (#F3F4F6) for a clean, modern look, suitable for both light and dark modes.
- Accent color: Teal (#14B8A6) for interactive elements and highlights, providing a fresh and energetic feel.
- Body and headline font: 'Inter' sans-serif for a modern, readable experience. The app's content is displayed clearly and efficiently using this font, suitable for both headlines and body text
- Use simple, geometric icons from a set like 'Remix Icon' or 'Tabler Icons'. Consistent style throughout.
- Card-based layout centered on the page. Responsive design for all screen sizes.  Use subtle shadows for depth.
- Subtle transitions on button hovers, input focus, and the dark mode toggle.  Use Tailwind's `transition-colors` and `duration-300` classes.