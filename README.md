# Constellation Operator Dashboard

A comprehensive distributed control system for scientific experiments. This platform provides real-time monitoring, satellite network management, and a centralized data observatory within a modern, responsive web application.

## Overview

The Constellation Operator Dashboard is a mission-critical tool designed to visualize complex distributed systems. Key capabilities include:

- **Live Telemetry & Monitoring:** Real-time data streaming and visualizations for critical metrics such as system load, active nodes, network traffic, and error rates.
- **Satellite Management:** View, track, and manage constellation endpoints with detailed orbital status, health indicators, and signal strength readouts.
- **Global Observatory:** World map integration for visualizing the geographical distribution of network nodes.
- **Real-time Log Console:** Live streaming capability of system-wide component logs directly to your dashboard.
- **Dark Mode Interface:** Built with a professional, high-contrast design intended for long-session monitoring applications.

## Technical Architecture

This project is built using:
- **Framework:** Next.js (React Server Components and App Router)
- **Styling:** Tailwind CSS
- **Component Library:** Radix UI Headquarters (Headless UI components)
- **Iconography:** Lucide React
- **Data Visualization:** Recharts

## Getting Started

### Prerequisites
Ensure that a modern Node.js environment is configured on your machine, along with a package manager (`npm`, `yarn`, or `pnpm`).

### Local Development Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/abhishek-8081/Dashboard-Task.git
   cd Dashboard-Task
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Verify the application is running by opening [http://localhost:3000](http://localhost:3000) in your web browser.

## Deployment Instructions (Vercel)

Deploying this Next.js project to Vercel is highly recommended for optimal performance.

1. Ensure your latest code is pushed to the `main` branch of this GitHub repository.
2. Navigate to [Vercel](https://vercel.com/) and log in using your GitHub account.
3. Select **Add New...** > **Project** from your Vercel Dashboard.
4. Locate the `Dashboard-Task` repository in the list and select **Import**.
5. Vercel automatically detects the Next.js framework. No configuration changes are required for the Build and Output Settings.
6. Select **Deploy**.

Vercel will manage the CI/CD pipeline, automatically provisioning a production URL and triggering new deployments upon subsequent pushes to the `main` branch.

## Directory Structure

- `app/`: Next.js App Router definitions and page layouts.
- `components/`: Modular, reusable React components.
  - `ui/`: Foundational design system components.
- `lib/`: Core utility functions, global state management, and strict TypeScript definitions.
- `hooks/`: Specialized custom React hooks.

## License

This project is available under the MIT License.
