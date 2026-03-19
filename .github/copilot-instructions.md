# ApplyHoff — Project Instructions

## Project Overview
ApplyHoff is a React Native (Expo) job application tracker app built with TypeScript.
It uses React Native Web for localhost browser preview during development.

## Tech Stack
- **Framework:** Expo SDK 55 + React Native + TypeScript (strict)
- **Web Preview:** React Native Web + @expo/metro-runtime
- **Navigation:** Expo Router (file-based routing in `app/` directory)
- **State Management:** Zustand (planned)
- **Local Storage:** SQLite via expo-sqlite (planned, offline-first)
- **Styling:** Token-based StyleSheet system — NO SCSS, NO inline styles in screens

## Design Principles
- Modern, minimal, warm aesthetic
- Color palette: beige, sand, terracotta, soft orange tones (see `src/theme/colors.ts`)
- Components-first: all UI is built from reusable base components in `src/components/`
- No raw `<View>` or `<Text>` with hardcoded styles in screen files
- Use theme tokens for ALL visual values (colors, spacing, typography, radii, shadows)

## Code Conventions
- TypeScript strict mode, no `any` unless absolutely necessary
- English for all code, comments, and documentation
- Functional components with hooks only
- Named exports for all components (no default exports except route files)
- Props interfaces defined above the component in the same file
- Import from barrel exports: `import { Button, Card } from '@/components'`

## Architecture
```
src/
  components/   — Reusable UI building blocks (Button, Card, Input, Header, etc.)
  theme/        — Design tokens: colors, spacing, typography, shadows, radii
  screens/      — Screen-level components (composed from base components)
  types/        — Shared TypeScript type definitions
  store/        — Zustand stores
  utils/        — Pure helper functions
app/            — Expo Router file-based routes (layouts + pages)
```

## Workflow Rules
- Build in small steps, review after each step, then git commit
- Test in browser (localhost via `npm run web`) after each visual change
- Every new screen must use existing components and theme tokens
- Document new components and architectural decisions
