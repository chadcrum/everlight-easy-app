# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js web application for controlling Everlight LED sequences with a cyberpunk-themed UI. The app fetches available light patterns from a hardware controller and allows users to select and apply them through a grouped, expandable interface.

## Development Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Configuration

The app requires two environment variables in `.env.local`:
- `LIGHT_CONTROLLER_IP` - IP address of the Everlight controller (default: 192.168.1.47)
- `ZONE_ID` - Target zone ID for light commands (default: a0b76544fe9d)

Configuration is centralized in `src/lib/config.ts` and used by API routes.

## Architecture

**API Proxy Pattern**: The app uses Next.js API routes (`/api/sequences` and `/api/submit`) to proxy requests to the hardware controller, avoiding CORS issues in the browser.

**Data Flow**:
1. Frontend calls `/api/sequences` to fetch available light patterns
2. API route forwards request to `http://{LIGHT_CONTROLLER_IP}/v1/sequences` with 3-second timeout
3. On timeout/failure, falls back to `response.json` file for development/demo purposes
4. User selects a pattern, frontend calls `/api/submit` with the pattern data
5. API route sends POST to `http://{LIGHT_CONTROLLER_IP}/v1/zones/{ZONE_ID}/sequence`

**UI Architecture**: The interface uses a grouped, collapsible cyberpunk design:
- Light patterns are organized by their `groups` field from the API response
- Each group renders as an expandable GroupCard component
- Patterns can appear in multiple groups (cross-group membership)
- Individual patterns render as LightCard components with cyberpunk styling
- Cards display only the pattern `alias` for clean presentation

**Cyberpunk Theme Implementation**:
- Extensive CSS animations in `src/app/globals.css` including matrix rain, scanning lines, and neon effects
- Uses custom CSS variables for neon colors (cyan, pink, green, purple, orange)
- Background effects include digital noise, holographic overlays, and grid patterns
- Typography uses Orbitron and Rajdhani fonts for cyberpunk aesthetics

**TypeScript Interfaces**:
- `LightSequence`: Defines the structure of patterns received from the controller (includes `alias`, `groups`, `pattern`, `colorMode`, `effects`)
- `LightSubmission`: Defines the payload sent to apply a pattern

**Component Hierarchy**:
- `page.tsx`: Main UI logic, groups management, API calls, cyberpunk loading states
- `GroupCard.tsx`: Collapsible group containers with expand/collapse state and cyberpunk styling
- `LightCard.tsx`: Individual pattern selection cards with neon effects and scanning animations
- `MessageDisplay.tsx`: Success/error feedback component with terminal-style messaging

## Important Development Notes

**Hardware Controller Integration**: 
- API routes include AbortController with 3-second timeout to prevent hanging requests
- Fallback to `response.json` ensures UI remains functional during development
- The `response.json` file contains sample data with 97 light sequences organized into groups

**Path Resolution**: 
- Uses TypeScript path mapping (`@/*` -> `./src/*`) configured in `tsconfig.json`
- Import paths like `@/types/light` and `@/components/GroupCard` should resolve correctly
- If imports fail, check that Next.js dev server has restarted after tsconfig changes

**Grouping Logic**:
- Sequences are grouped by iterating through each sequence's `groups` array
- A single sequence can appear in multiple groups
- Groups are dynamically created from the API data
- Group names are cleaned (removing "EverLights/" prefixes) for display

**Styling Architecture**:
- Global cyberpunk styles in `globals.css` with extensive keyframe animations
- Tailwind CSS used for layout and spacing
- Custom CSS classes for cyberpunk effects (neon-text, cyber-card, matrix-rain, etc.)
- Reduced motion support included for accessibility

## Troubleshooting

**UI Not Showing Data**: Most commonly caused by import path issues or API timeouts. Check browser console for errors and verify API endpoints return data within 3 seconds.

**Cyberpunk Animations Not Working**: Ensure `globals.css` is imported in `layout.tsx` and Orbitron font is loaded from Google Fonts.

**API Timeouts**: The hardware controller at the configured IP may be unreachable. The app will fall back to `response.json` for development.