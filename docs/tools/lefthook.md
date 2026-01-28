# Lefthook Configuration

The purpose of `lefthook` is running tasks on certain git actions.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)

## Prerequisites

- [➡ commitlint](./commitlint.md) - linting commit message

## Setup

- Add workspace reference to `lefthook`:

  ```sh
  pnpm add -D -w lefthook
  ```

- Manually install `lefthook` hooks:

  ```sh
  npx lefthook install
  ```

- Add `pre-commit` hook for linting and formatting indexed files:

  ```yaml
  # lefthook.yml

  pre-commit:
    parallel: true
    commands:
      lint:
        glob: "*.{js,ts,jsx,tsx}"
        run: pnpm lint {staged_files}
  ```

- Add `commit-msg` hook for commit message linting using [commitlint](./commitlint.md):

  ```yaml
  # lefthook.yml

  commit-msg:
    scripts:
      "commit_check":
        runner: bash
  ```

- And create a bash script to verify commit message:

  ```sh
  # .lefthook/commit-msg/commit_check

  if ! npx commitlint --edit --verbose; then
    exit 1
  fi
  ```

## Usage

- **Automatic**: Execution of linting and [commitlint](./commitlint.md) on commit.\
  In case of any failures, the commit will be rejected.

[⬅ Back](../../README.md)
