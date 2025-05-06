# Tarkov WebApp

This repository contains the source code for a final-year Computing dissertation project developed at Solent University. The web application demonstrates how user experience (UX) principles can improve accessibility and usability when navigating complex datasets.

The application uses in-game data from *Escape From Tarkov* (Battlestate Games, 2015) as a proof-of-concept environment due to the game's extensive and unstructured data systems.

## Project Overview

The aim of the project is to explore how UX design principles such as progressive disclosure, interactive filtering, and onboarding tutorials can reduce cognitive overload and improve navigation efficiency for users.

Key features of the application include:

- A dynamically filtered loadout builder
- A progressively disclosed ammunition statistics page
- An interactive map interface with contextual tooltips and optional guidance
- One-time onboarding tutorials to support beginner users

## Technologies Used

- Next.js (React framework)
- GraphQL with Apollo Client
- Tarkov.dev API
- Leaflet for mapping
- CSS Modules

## Installation and Usage

To run the application locally:

### 1. Clone the repository
git clone https://github.com/KallumLansley/tarkov-webapp.git
cd tarkov-webapp

2. Install dependencies

npm install

3. Start the development server

npm run dev
