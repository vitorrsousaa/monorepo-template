# Shared commitlint configuration

The purpose of the `commitlint` is linting of a commit message to conform the following format:

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

- Add workspace reference to `@commitlint` and its peer dependencies:

  ```sh
  yarn add -D -w @@commitlint/config-conventional @commitlint/cli
  ```

- Add commitlint configuration file:

  ```js
  // .commitlintrc.js

  {
	  "extends": ["@commitlint/config-conventional"]
  }
  ```

## Automation

- Setup [➡ lefthook](../../docs/tools/lefthook.md) to schedule `commitlint` execution on commit.

## Usage

- **Automatic** validation of commit message with `commitlint` on commit.\
  In case of invalid message, commit will be rejected.


[⬅ Back](../../README.md)
