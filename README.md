# Everlight Control Panel

A Next.js web application for controlling Everlight sequences.

## Features

- View available light sequences in a card-based interface
- Select and apply light patterns
- Configurable IP address and zone ID
- Success/error message handling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables in `.env.local`:
   ```
   LIGHT_CONTROLLER_IP=192.168.1.47
   ZONE_ID=a0b76544fe9d
   ```

3. Run the development server:
   ```bash
   npm run dev
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