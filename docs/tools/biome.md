# Shared Biome Configuration

[BiomeJS](https://biomejs.dev/) for code linting and formatting.

The purpose of `biome` is linting and formatting `javascript` and `typescript` languages (`js`, `ts`, `tsx`).

> To make sure Biome formats when saving. Add `"editor.formatOnSave": true` in your VSCode personal settings.
> To make sure Biome formats when saving. Add [Extension:Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) in your VSCode.

## Contents

- [Setup](#setup)
- [Usage](#usage)

## Setup

- Add workspace reference to `@biomejs/biome`:

  ```sh
  pnpm add -w @biomejs/biome
  ```

- Add biome configuration file:

  ```jsonc
  // biome.json

  {
    "$schema": "https://biomejs.dev/schemas/1.7.0/schema.json",
    "organizeImports": {
      "enabled": true,
    },
    "linter": {
      "enabled": true,
      "rules": {
        "recommended": true,
      },
    },
  }
  ```

- Add biome scripts for each package:

  ```jsonc
  // package.json

  "scripts": {
    ...
    "lint": "biome lint --apply ./src",
    "format": "biome format --write ./src",
    "check": "biome check --apply ./src"
    ...
  }
  ```

You can format files and directories using the `format` command:

```bash
pnpm format
```

You can lint and apply safe fixes using the `lint` command:

```bash
pnpm lint
```

## Usage

- **Automatic**: File validation with `biome` on save.
- **Automatic**: Staged file validation with `biome` on commit.
- Manual usage from command line:

  ```sh
  pnpm lint .
  pnpm format .
  ```

[⬅ Back](../../README.md)
