# @repo/ui

Shared React component library based on [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/).

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Component Generation](#component-generation)

## Installation

```sh
pnpm add @repo/ui
```

## Usage

### Import Components

```typescript
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Dialog } from "@repo/ui/dialog";
```

### Import Utilities

```typescript
import { cn } from "@repo/ui/utils";
```

### Import Providers

```typescript
import { ThemeProvider } from "@repo/ui/providers";
```

### Import Styles

```typescript
import "@repo/ui/styles/theme.css";
```

## Components

The following components are available:

- `Alert` - Alerts and notifications
- `Avatar` - User avatar
- `Badge` - Badges and tags
- `Breadcrumb` - Breadcrumb navigation
- `Button` - Buttons
- `Card` - Cards and containers
- `Checkbox` - Checkboxes
- `Collapsible` - Collapsible elements
- `Command` - Command palette
- `Dialog` - Modals and dialogs
- `DropdownMenu` - Dropdown menus
- `Form` - Forms with react-hook-form
- `Icon` - Icons
- `Input` - Input fields
- `Label` - Form labels
- `Select` - Selectors
- `Separator` - Visual separators
- `Sheet` - Side panels
- `Sidebar` - Sidebars
- `Skeleton` - Loading placeholders
- `Textarea` - Text areas
- `ThemeToggle` - Theme toggle
- `Tooltip` - Tooltips

## Component Generation

Use the Turbo generator to create new components:

```sh
pnpm generate:component
```

Or directly:

```sh
cd packages/ui
pnpm generate:component
```

This will create a new component following the established pattern.

## Configuration

### Tailwind CSS

The package exports Tailwind configurations:

```typescript
import tailwindConfig from "@repo/ui/tailwind.config";
```

### PostCSS

The package exports PostCSS configuration:

```typescript
import postcssConfig from "@repo/ui/postcss.config";
```

## Structure

```
packages/ui/
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── providers/     # React providers
│   ├── styles/        # CSS styles
│   └── utils/         # Utilities
└── dist/              # Build output
```

[⬅ Back](../README.md)
