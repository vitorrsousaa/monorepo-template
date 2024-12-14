# Lefthook configuration

The purpose of the `lefthook` is running tasks on certain git actions.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)

## Prerequisites

- [➡ commitlint](../../packages/commitlint/README.md) - linting commit message

## Setup

- Add workspace reference to `lefthook`:

  ```sh
  yarn add -D -w lefthook
  ```

- Manually install `lefthook` hooks:

  ```sh
  npx lefthook install
  ```

- Add `pre-commit` hook for linting and formatting indexed files using staged-files

  ```sh
  # lefthook.yml
  
  pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: yarn lint {staged_files}
  ```

- Add `commit-msg` hook for linting of commit message using [commitlint](../../tools/commitlint/README.md):

  ```sh
  # lefthook.yml
  
  commit-msg:
  scripts:
    'commit_check':
      runner: bash
  ```
  
- And create a bash script to verify commit message

  ```sh
  # .lefthook/commit-msg/commit_check
  
  if ! npx commitlint --edit --verbose; then
    exit 1
  fi
  ```

## Usage

- **Automatic** execution and [commitlint](../../tools/commitlint/README.md) on commit.\
  In case of any failures, commit will be rejected.

[⬅ Back](../../README.md)
