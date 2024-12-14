# Shared vitest configuration

The purpose of the [vitest](https://vitest.dev/) is to test `javascript`.

> This configuration targets **lib typescript** packages.

---

## Contents

- [Setup](#setup)

## Setup

- Add workspace reference to `@shared/vitest-presets` and its peers dependencies:

  ```sh
  yarn add -D @shared/vitest-presets 
  ```

- Add vitest configuration file

  ```js
  // packages/baz/vitest.config.ts

  import { defineProject, mergeConfig } from "vitest/config";
  // @ts-ignore
  import configShared from "@shared/vitest-presets/browser/vitest.config";

  export default mergeConfig(
    configShared,
    defineProject({
      test: {
        globals: true,
      },
    }),
  );
  ```

[⬅ Back](../../README.md)