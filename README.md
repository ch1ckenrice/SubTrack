# SubTrack

SubTrack is a responsive Angular portfolio project for tracking recurring subscriptions, upcoming payments, monthly spending, and budget usage.

The goal of this project is to practice modern Angular features through a realistic product-style app instead of a simple demo.

## Features

- Add, edit, delete, search, and filter subscriptions
- Track monthly and yearly billing cycles
- Automatically move past billing dates forward
- Keep paid payment history for past subscription dates
- View upcoming payments in a calendar
- Highlight paid and upcoming payment days
- Analyze monthly spend by category
- Display a spending distribution donut chart
- Configure monthly budget and reminder window
- Persist data in LocalStorage
- Responsive layout for desktop, tablet, and mobile screens

## Tech Stack

- Angular
- TypeScript
- Angular Signals
- Reactive Forms
- Standalone Components
- SCSS
- LocalStorage
- Prettier

## What I Practiced

- Building a multi-page Angular application with routing
- Managing state with Angular Signals and computed values
- Creating reusable components
- Working with strongly typed models
- Building and validating reactive forms
- Persisting user data locally
- Handling dates and recurring billing logic
- Creating responsive layouts with CSS Grid and Flexbox
- Refactoring repeated formatting logic into shared utilities

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Open the app in the browser:

```text
http://localhost:4200
```

## Available Scripts

Run the app locally:

```bash
npm start
```

Build the project:

```bash
npm run build
```

Format the codebase:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run tests:

```bash
npm test
```

## Project Status

The main functionality is complete. The project includes subscription management, analytics, calendar views, settings, LocalStorage persistence, and responsive styling.

## Screens

- Dashboard — high-level budget and payment overview
- Subscriptions — subscription CRUD, filters, and search
- Calendar — recurring payment schedule
- Analytics — category totals and spending split
- Settings — budget, currency, reminder window, and reset controls
