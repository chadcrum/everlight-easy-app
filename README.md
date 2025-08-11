# Everlight Control Panel

A Next.js web application for controlling Everlight sequences.

## Features

- View available light sequences in a card-based interface
- Select and apply light patterns
- Configurable IP address and zone ID
- Success/error message handling

## Setup

1. Build the Docker image:
   ```bash
   docker-compose build
   ```

2. Run the application:
   ```bash
   docker-compose up
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/sequences` - Fetches available light sequences from the controller
- `POST /api/submit` - Submits selected pattern to the light controller

## Technology Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- React