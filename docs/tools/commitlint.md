# Shared Commitlint Configuration

The purpose of `commitlint` is linting commit messages to conform to the following format:

```js
type(scope?): subject
```

You can read more about conventional commits in the link below:
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Contents

- [Setup](#setup)
- [Automation](#automation)
- [Usage](#usage)

## Setup

- Add workspace reference to `commitlint` and its dependencies:

  ```sh
  pnpm add -D -w @commitlint/config-conventional @commitlint/cli
  ```

- Add commitlint configuration file:

  ```json
  // .commitlintrc

  {
    "extends": ["@commitlint/config-conventional"]
  }
  ```

## Automation

- Setup [➡ lefthook](./lefthook.md) to execute `commitlint` on commit.

## Usage

- **Automatic**: Commit message validation with `commitlint` on commit.\
  In case of invalid message, the commit will be rejected.

[⬅ Back](../../README.md)
