# Everlight Control Panel

A Next.js web application for controlling Everlight sequences.

## Features

- View available light sequences in a card-based interface
- Select and apply light patterns
- Configurable IP address and zone ID
- Success/error message handling

## Setup

1. Create environment configuration:
   Create a `.env` file in the project root with your light controller settings:
   ```env
   # Light Controller Configuration
   LIGHT_CONTROLLER_IP=192.168.4.27
   ZONE_ID=a0b76544fe9d
   ```
   
   **Note**: For local development, you can use `.env.local` instead. However, Docker production builds require `.env` since Next.js only loads `.env.local` in development mode.

2. Build the Docker image:
   ```bash
   docker-compose build
   ```

3. Run the application:
   ```bash
   docker-compose up
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/sequences` - Fetches available light sequences from the controller
- `POST /api/submit` - Submits selected pattern to the light controller

## Technology Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- React