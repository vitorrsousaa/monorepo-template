# Shared typescript configuration

The purpose of the [typescript](https://www.typescriptlang.org/) is to add strong typing to `javascript`.

> This configuration targets **lib typescript** packages.

---

## Contents

- [Setup](#setup)

## Setup

- Add workspace reference to `@muravjev/configs-ts` and its peers dependencies:

  ```sh
  yarn add -D @shared/typescript-config
  ```

- Add typescript configuration file

  ```jsonc
  // packages/baz/tsconfig.json

  {
    "extends": "@shared/typescript-config/react-library.json",
    "compilerOptions": {
      "lib": ["dom", "ES2015"],
      "types": ["vitest/globals", "node"],
      "baseUrl": ".",
      "paths": {
        "@utils/*": ["./src/utils/*"]
      }
    },
    "include": ["."],
    "exclude": ["dist", "build", "node_modules"]
  }
  ```

[⬅ Back](../../README.md)
