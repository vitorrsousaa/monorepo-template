# CLI - Code Generation Tool

A powerful command-line interface tool for generating boilerplate code for your API application. This CLI helps you quickly scaffold modules, controllers, services, and providers following consistent patterns and best practices.

## Overview

The CLI tool (`cosmos`) is designed to accelerate development by automating the creation of common code structures. It generates TypeScript files with proper naming conventions, directory structures, and template code that follows your project's architecture.

## Installation

The CLI is part of this monorepo. To use it, you need to build it first:

```bash
# From the monorepo root
pnpm build --filter=cli

# Or from the CLI directory
cd apps/cli
pnpm build
```

## Usage

After building, you can run the CLI using:

```bash
# From the monorepo root
pnpm --filter=cli start create

# Or using the binary directly (after building)
node apps/cli/dist/index.js create
```

### Global Installation (Optional)

To use the CLI globally, you can link it:

```bash
cd apps/cli
pnpm link --global
```

Then use it from anywhere:

```bash
cosmos create
```

## Commands

### `create`

The main command that provides an interactive interface for generating code.

```bash
cosmos create
```

This command will prompt you with a series of questions to determine what to create and where.

## What Can Be Created

### 1. Module

Creates a complete module structure with:
- A default controller
- A default service
- Proper directory structure (`controllers/` and `services/` subdirectories)
- Index files for exports

**Prompts:**
- Module name
- Default service name (used for the initial controller and service)

**Generated Structure:**
```
api/src/app/modules/{module-name}/
├── controllers/
│   └── {service-name}/
│       ├── controller.ts
│       └── index.ts
└── services/
    └── {service-name}/
        ├── service.ts
        └── index.ts
```

**Example:**
```bash
cosmos create
# Select: module
# Module name: users
# Service name: create-user
```

### 2. Controller

Creates a new controller within an existing module.

**Prompts:**
- Module name (must exist)
- Controller name

**Generated Structure:**
```
api/src/app/modules/{module-name}/controllers/{controller-name}/
├── controller.ts
└── index.ts
```

**Generated Controller Template:**
- Implements `IController` interface
- Includes authentication middleware
- Error handling with `errorHandler`
- Field validation with `missingFields`
- Proper TypeScript types

**Example:**
```bash
cosmos create
# Select: controller
# Module name: users
# Controller name: update-user
```

### 3. Service

Creates a new service within an existing module.

**Prompts:**
- Module name (must exist)
- Service name

**Generated Structure:**
```
api/src/app/modules/{module-name}/services/{service-name}/
├── service.ts
└── index.ts
```

**Generated Service Template:**
- Implements `IService` interface
- Zod schema for input validation
- TypeScript types for input/output
- Proper class structure

**Example:**
```bash
cosmos create
# Select: service
# Module name: users
# Service name: delete-user
```

### 4. Provider

Creates a new provider in the providers directory.

**Prompts:**
- Provider name

**Generated Structure:**
```
api/src/app/providers/{provider-name}/
├── provider.ts
├── types.ts
└── index.ts
```

**Generated Provider Template:**
- Provider class with config injection
- TypeScript interface for the provider
- Proper exports

**Example:**
```bash
cosmos create
# Select: provider
# Provider name: email
```

## Naming Conventions

The CLI automatically converts your input to the appropriate naming convention:

- **Directories**: kebab-case (e.g., `create-user`, `user-profile`)
- **Classes**: PascalCase (e.g., `CreateUserController`, `UserProfileService`)
- **Variables**: camelCase (e.g., `createUserInput`, `userProfile`)

### Utility Functions

The CLI includes utility functions for name conversion:
- `toPascalCase()`: Converts to PascalCase
- `toCamelCase()`: Converts to camelCase
- `toKebabCase()`: Converts to kebab-case

## Generated Code Templates

### Controller Template

Controllers include:
- Authentication middleware integration
- Request/response handling
- Field validation
- Error handling
- Service integration (placeholder)

### Service Template

Services include:
- Zod schema for input validation
- TypeScript types for input and output
- Service interface implementation
- Execute method structure

### Provider Template

Providers include:
- Configuration injection
- Type definitions
- Interface implementation
- Basic handler method

## File Structure

The CLI generates files in the following locations:

- **Modules**: `api/src/app/modules/{module-name}/`
- **Providers**: `api/src/app/providers/{provider-name}/`

All paths are relative to the monorepo root.

## Error Handling

The CLI includes built-in validation:

- **Module existence check**: Prevents creating controllers/services in non-existent modules
- **Duplicate detection**: Warns if a resource already exists
- **Name validation**: Ensures names are not empty
- **Error messages**: Clear feedback when operations fail

## Development

### Building

```bash
pnpm build
```

### Development Mode (Watch)

```bash
pnpm dev
```

This will watch for changes and rebuild automatically.

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm typecheck
```

### Formatting

```bash
pnpm format
```

## Dependencies

- **commander**: Command-line interface framework
- **inquirer**: Interactive command-line prompts
- **fs-extra**: Enhanced file system operations

## Project Structure

```
apps/cli/
├── src/
│   ├── commands/
│   │   ├── create/
│   │   │   ├── controller.ts
│   │   │   ├── module.ts
│   │   │   ├── provider.ts
│   │   │   ├── service.ts
│   │   │   └── templates/
│   │   │       ├── controller.ts
│   │   │       ├── provider.ts
│   │   │       └── service.ts
│   │   └── services/
│   │       └── create.ts
│   ├── index.ts
│   └── utils.ts
├── dist/
├── package.json
└── tsconfig.json
```

## Best Practices

1. **Module First**: Create modules before adding controllers or services to them
2. **Naming**: Use descriptive, clear names for your resources
3. **Consistency**: Follow the naming conventions automatically applied by the CLI
4. **Review Generated Code**: Always review and customize the generated templates to fit your specific needs

## Troubleshooting

### "Module does not exist" Error

Ensure the module exists before creating controllers or services within it. Create the module first using the `module` option.

### "Resource already exists" Error

The CLI prevents overwriting existing resources. If you need to recreate a resource, delete the existing directory first.

### Build Errors

Make sure you've built the CLI before using it:
```bash
cd apps/cli
pnpm build
```

## Contributing

When adding new templates or commands:

1. Add the command handler in `src/commands/`
2. Create templates in `src/commands/create/templates/`
3. Update the main command handler in `src/index.ts`
4. Test thoroughly before committing

## License

ISC

