# BOE Analytics

⚠️ Project under development ⚠️

This project aims to create summaries of the Spanish Official State Gazette (BOE) using Artificial Intelligence. It employs scraping techniques and queries to the [DeepSeek](https://www.deepseek.com) API, a powerful open-source LLM.

In addition to the summaries, an analysis is performed on the neutral points and the positive and negative aspects of each BOE, keywords, etc.

The goal is for users to obtain relevant information from the BOE published on a specific date, in a quick, simple, and accessible way.

Due to the nature of the project, [Vue 3](https://vuejs.org/) and [Nuxt 3](https://nuxt.com/) have been chosen for the application development. The main language of the application is Spanish, although the possibility of future translation to English is not ruled out for foreign residents in Spain who wish to use the application to obtain BOE information.

## DeepSeek

The [DeepSeek](https://www.deepseek.com) API, a powerful open-source LLM, is used to analyze the BOEs. If you want to try the project, you can register at [DeepSeek](https://www.deepseek.com) and obtain an API key.

You will need to create a `.env` file in the project root with the following variable:

```
DEEPSEEK_APIKEY=your-api-key

# In order to use the backend integration with Supabase, you will need to create a `.env` file in the project root with the following variables:
# I will create a function to generate the database and tables in Supabase to help anyone who wants to try the project.
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## Features

- [x] Generation of summary, stats, positive/negative/neutral aspects, main points, affected areas and keywords.
- [x] Calendar integration to navigate through the BOEs using dynamic route.
- [x] Backend integration with Supabase.

## Setup

Make sure to install dependencies:

```bash
# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```
