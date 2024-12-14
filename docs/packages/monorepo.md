# Package configuration

The purpose of the **[package ↗](https://docs.npmjs.com/about-packages-and-modules)** is keeping app/lib information (version, name, description, dependencies, scripts etc.).

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)

## Prerequisites

- [➡ yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) - management package

## Setup

- Create `package.json` file:

  ```jsonc
  // package.json

  {
    // Package info

    "name": "monorepo-template",
    "private": true,
    "description": "...",
    "author": "...",
    "license": "MIT",

    // Common scripts

    "scripts": {
      "clean": "rimraf \"**/node_modules\" && pnpm -r clean",
      "fresh": "pnpm clean && pnpm i",
      "nuke": "rimraf pnpm-lock.yaml && pnpm fresh"
    },

    // Prevent using other package managers except pnpm

    "engines": {
      "node": ">=18",
    },
    "packageManager": "yarn@1.22.17",
  }
  ```

- Add npm configuration file:

  ```yaml
  # .npmrc

  auto-install-peers = true
  ```

- Add vitest workspace file:

  ```yaml
  # vitest.workspace.ts

  export default ["packages/*", "apps/*"];
  ```



[⬅ Back](../../README.md)
