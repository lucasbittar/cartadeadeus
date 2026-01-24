Role: Senior Full Stack Creative Developer Project Name: #CartaDeAdeus - Interactive Fan Experience for Fresno’s New Album

Context: I am building a high-end interactive hotsite for fans of the Brazilian (so the entire site should be in Portuguese-BR,
the code in plain English, please) band Fresno to celebrate their upcoming album "Carta de Adeus".
The theme is based on the quote: "For every time I needed words and couldn't find them, I made a letter. All of them are of goodbye."
Quote in Portuguese: "Para cada vez que precisei de palavras e não as encontrei, fiz uma carta. Todas elas são de adeus."

Objective: Create a web application where fans can write their own "goodbye letters" (anonymous or identified).
These letters will be plotted as glowing points on a 3D interactive globe and will generate beautiful, shareable
social media assets to catch the band's attention.

Tech Stack:

Framework: Next.js (App Router)
Database/Auth: Supabase (for storing letter content and geolocation coordinates)
3D Visualization: Three.js (specifically using three-globe or a custom ShaderMaterial globe)
Image Generation: Satori (to generate dynamic OpenGraph images and Instagram-ready PNGs of the letters)
Styling: Tailwind CSS (let's bring the frontend design skill to implement a premium look following the album's aesthetic: @refs/branding.jpg)
Animation: Framer Motion (for smooth transitions and interactions)

Functional Requirements:

Hero Section:

Display the provided album artwork (@refs/fresno.jpg) as a high-impact background or featured element.
Include the core quote in a minimalist, elegant typography.

A primary CTA: "Write your Goodbye".
In Portuguese: "Escreva sua Carta de Adeus".

The "Letter" Engine:

A text input with a character limit (max 280 for impact).
Toggle for "Post Anonymously" vs "Include my Name/Handle".
Integration with a Geolocation API (or simple city search) to get Lat/Long coordinates for the globe.
On submission, save the data to Supabase.

The Global Constellation (3D Globe):
A Three.js interactive globe that occupies a significant portion of the screen.
Render each letter as a glowing point based on its coordinates.
On hover/click of a point, show a "ghostly" preview of the letter content in a minimalist tooltip.
The globe should have a slow, melancholic rotation.

The Sharing Engine (Satori):

Design a template for the shared image: a vintage letter/envelope aesthetic with the user's text.
Must include the hashtag #CartaDeAdeus and the band's handles: @fresnorock and @lucasfresno.
Generate a downloadable PNG for Instagram Stories and a pre-filled "Share on X" button.

Design Aesthetic:
Vibe: Clean, bright, melancholic, minimalist, premium with accents of red. You will notice in the reference (@refs/fresno.jpg) that we have lots of paper floating in the air.
If we could generate an effect with sheets of paper falling in the background, that would be amazing. Let's bring the frontend design skills to implement this premium look.

Colors: #FFFFFF (Background), image's red (Text), and a specific accent color for the "glow" (e.g., deep red).

Fonts: Monospace for the "letter" feel, Sans-serif for the UI.

Implementation Steps:

Initialize the Next.js project with Tailwind.
Set up the Supabase schema (Tables: letters with fields content, author, is_anonymous, lat, lng, city).
Create the Three.js Globe component (using react-three-fiber preferred).
Develop the Satori API route for dynamic image generation.
Build the submission flow with a focus on smooth transitions and "emotional" UX.
