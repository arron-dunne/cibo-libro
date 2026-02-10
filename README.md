# Cibo Libro

A recipe management web app for saving, organizing, and cooking your favorite recipes.

## About

Cibo Libro lets you build a personal recipe collection from anywhere on the web or from scratch. Import recipes from URLs with automatic extraction, or add them manually. When you're ready to cook, a distraction-free cook mode walks you through each step — no more scrolling past life stories.

## Features

- **Recipe import** — paste a URL and recipes are automatically extracted via JSON-LD parsing
- **Link cards** — when full import isn't possible (paywalled sites, missing data), save a quick-reference link card instead
- **Manual recipes** — add your own recipes with a full-featured form
- **Cook mode** — step-by-step distraction-free cooking view
- **Tags** — organize recipes with custom tags
- **Search, sort & filter** — find recipes across your collection by title, tags, and other properties
- **Image uploads** — recipe images stored on Cloudflare R2 with presigned URLs
- **Mobile-first** — responsive design optimized for phones and desktops

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth v5 |
| Styling | Tailwind CSS |
| Image Storage | Cloudflare R2 |
| Deployment | Vercel |
