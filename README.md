# Constellation Operator Dashboard

![Constellation Operator Dashboard](./public/placeholder-logo.png)

A comprehensive distributed control system for scientific experiments. This platform provides real-time monitoring, satellite network management, and a centralized data observatory within a modern, responsive web application.

## Features

- **🌐 Live Telemetry & Monitoring:** Real-time data streaming and visualizations for critical metrics like system load, active nodes, network traffic, and error rates.
- **🛰️ Satellite Management:** View, track, and manage constellation endpoints with orbital status, health indicators, and signal strength.
- **🗺️ Global Observatory:** World map integration for visualizing geographical distribution of network nodes.
- **📊 Real-time Log Console:** Live streaming capability of system-wide component logs directly to your dashboard.
- **🌙 Dark Mode Interface:** Built with a sleek, aesthetic design perfect for long-session monitoring applications.

## Tech Stack

This project is built using:
- [Next.js](https://nextjs.org) (React Framework)
- [Tailwind CSS](https://tailwindcss.com) (Styling)
- [Radix UI](https://www.radix-ui.com) (Headless UI components)
- [Lucide Icons](https://lucide.dev) (Iconography)
- [Recharts](https://recharts.org) (Data Visualization)

## Getting Started

### Prerequisites
Make sure you have Node.js and a package manager installed (`npm`, `yarn`, or `pnpm`).

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repository-url>
   cd Dashboard
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or npm install / yarn install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   # or npm run dev / yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Structure

- `app/`: Next.js App Router structure defining all application pages.
- `components/`: Modular, reusable UI components.
  - `ui/`: Base design system components.
  - `dashboard/`, `satellites/`, etc.: Feature-specific components.
- `lib/`: Utility functions, state management, and type definitions.
- `hooks/`: Custom React hooks.

## License

This project is open-source and available under the MIT License.
