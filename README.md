# ApplyHoff

A modern, warm-themed job application tracker built with React Native (Expo) and TypeScript.
Designed for offline-first usage with browser preview via React Native Web.

## Quick Start

```bash
# Install dependencies
npm install

# Start in browser (localhost)
npm run web

# Start on mobile
npm run android   # or
npm run ios
```

## Project Structure

```
applyhoff/
├── app/                    # Expo Router — file-based routes
│   ├── _layout.tsx         # Root layout (SafeArea, Stack navigator)
│   └── index.tsx           # Home screen (component showcase)
├── src/
│   ├── components/         # Reusable UI building blocks
│   │   ├── Badge.tsx       # Status/category badge
│   │   ├── Button.tsx      # Pressable button (4 variants, 3 sizes)
│   │   ├── Card.tsx        # Container card with elevation
│   │   ├── EmptyState.tsx  # Empty content placeholder
│   │   ├── Footer.tsx      # Screen footer
│   │   ├── Header.tsx      # Screen header with title + actions
│   │   ├── Input.tsx       # Text input with label and validation
│   │   ├── SectionTitle.tsx# Section heading
│   │   ├── StatusPill.tsx  # Colored status indicator
│   │   ├── Surface.tsx     # Background panel
│   │   └── index.ts        # Barrel export
│   ├── theme/              # Design tokens
│   │   ├── colors.ts       # Color palette (beige, orange, warm tones)
│   │   ├── spacing.ts      # Spacing scale (4px base)
│   │   ├── typography.ts   # Font sizes, weights, line heights
│   │   ├── radii.ts        # Border radius tokens
│   │   ├── shadows.ts      # Platform-aware shadow presets
│   │   └── index.ts        # Barrel export
│   ├── screens/            # Screen-level components (planned)
│   ├── types/              # Shared TypeScript types (planned)
│   ├── store/              # Zustand state management (planned)
│   └── utils/              # Helper functions (planned)
├── .github/
│   └── copilot-instructions.md  # Project conventions for AI assistants
├── app.json                # Expo configuration
├── tsconfig.json           # TypeScript config with path aliases
└── package.json
```

## Design System

The app uses a token-based design system with warm, modern aesthetics:

- **Colors:** Beige, sand, terracotta, soft orange — see `src/theme/colors.ts`
- **Spacing:** 4px base unit scale (xs=4, sm=8, md=16, lg=24, xl=32, xxl=48)
- **Typography:** System fonts with 8 preset styles (heading1–3, body, bodySmall, caption, label, button)
- **Shadows:** Platform-aware (iOS shadowColor, Android elevation, Web boxShadow)
- **Radii:** 5 presets (sm=6, md=10, lg=16, xl=24, full=9999)

## Base Components

| Component      | Description                                      |
|---------------|--------------------------------------------------|
| `Button`      | 4 variants (primary, secondary, outline, ghost), 3 sizes, loading state |
| `Card`        | Elevated container with border and padding        |
| `Surface`     | Background panel (default, alt, transparent)      |
| `Input`       | Text input with label, helper text, error state   |
| `Header`      | Screen header with title, subtitle, left/right slots |
| `Footer`      | Screen footer with safe area handling             |
| `Badge`       | Colored label pill (5 variants)                   |
| `StatusPill`  | Status indicator with colored dot                 |
| `SectionTitle`| Section heading text                              |
| `EmptyState`  | Empty content placeholder with optional action    |

## Tech Stack

- **Expo SDK 55** + React Native 0.83
- **TypeScript** (strict mode)
- **React Native Web** for browser preview
- **Expo Router** for file-based navigation
- **Zustand** for state management (planned)
- **SQLite** for offline-first local storage (planned)

## License

Private project.
