# Drink DB

A Next.js app for browsing cocktails using [TheCocktailDB](https://www.thecocktaildb.com/) API.

## Features

- **Random cocktail** — Home page shows a random drink in a card with image, instructions, and ingredients. “Get random cocktail” loads another.
- **Search** — Filter by **cocktail type** (Alcoholic, Non alcoholic, Optional alcohol) or **category** (e.g. Cocoa, Cocktail) via a single dropdown. Results are paginated (10 per page) with Previous/Next.
- **Drink detail** — Click a search result to see the full recipe in the same card layout. “Back to results” returns to the same search and page.

## Tech stack

- **Next.js 16** (App Router, bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app))
- **TypeScript**
- **Tailwind CSS v4**
- Server Components and Server Actions for data and revalidation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run dev`   | Start dev server        |
| `npm run build` | Build for production    |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint              |

## API

The app uses [TheCocktailDB](https://www.thecocktaildb.com/api.php) (no API key required):

- `random.php` — random drink (home)
- `list.php?a=list` — alcohol types for dropdown
- `list.php?c=list` — categories for dropdown
- `filter.php?a=<type>` — drinks by alcohol type
- `filter.php?c=<category>` — drinks by category
- `lookup.php?i=<id>` — full drink by ID (detail page)

## API

Coded with Cursor IDE. I collaborated with the agent to create a plan, and then incrementally added features and reviewed each set of changes.
