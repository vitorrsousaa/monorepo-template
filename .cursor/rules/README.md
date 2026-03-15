# Cursor Rules for Artemis Project

This folder contains Cursor AI rules that provide persistent guidance and enforce coding standards across the project.

## 📋 Available Rules (root)

### 1. **project-standards.mdc** (Always Active)
Core project standards that apply to all files:
- Naming conventions (files, components, functions, constants)
- Code organization and monorepo structure
- Import ordering
- Component patterns
- Error handling guidelines

### 2. **clean-architecture.mdc** (API and SPA modules)
Clean Architecture principles:
- Layer separation (Domain, Application, Infrastructure)
- Module structure for API and SPA
- Dependency Rule
- Mapper pattern for data transformation
- **Factory pattern for dependency injection** (standard format, naming, structure)

### 3. **domain.mdc**, **api-patterns.mdc**, **api-tasks-naming.mdc**
Domain rules, API patterns and naming (see file descriptions).

---

## 📋 React/SPA Rules (apps/spa/.cursor/rules)

Rules that apply only to the SPA (React) app live in **`apps/spa/.cursor/rules/`**:

- **import-standards.mdc** — Import path standards (`@` aliases), SPA aliases
- **react-patterns.mdc** — React/Next.js component patterns, RenderIf, props/hooks conventions
- **react-query-patterns.mdc** — React Query cache, query keys, hook return patterns
- **ui-reuse-components.mdc** — Reuso de Card, Button e componentes `@repo/ui`
- **spa-services-contracts.mdc** — Services devem usar tipos de `@repo/contracts`

Quando trabalhar apenas no SPA, abrir o workspace na pasta `apps/spa` faz com que essas rules sejam carregadas pelo Cursor.

## 🚀 How Rules Work

### Automatic Application

1. **Always Apply Rules**: Rules with `alwaysApply: true` are loaded in every conversation
   - Example: `project-standards.mdc`

2. **File-Specific Rules**: Rules with `globs` patterns are loaded when matching files are open
   - Example: `clean-architecture.mdc` loads when editing API or SPA module files
   - React/SPA rules in `apps/spa/.cursor/rules/` apply when working in the SPA app

### Manual Application

You can also mention rules explicitly in your prompts:
- "Follow the import standards"
- "Use the React patterns we defined"
- "Apply clean architecture principles"

## ✏️ Creating New Rules

1. Create a new `.mdc` file in this folder
2. Add YAML frontmatter with:
   - `description`: Brief description
   - `globs`: File pattern (optional)
   - `alwaysApply`: true/false
3. Write your rule content in Markdown
4. Keep it concise (< 500 lines)
5. Include concrete examples

### Example Structure

```markdown
---
description: Your rule description
globs: **/*.tsx
alwaysApply: false
---

# Rule Title

Your rule content with examples...

## ✅ GOOD
\`\`\`typescript
// Good example
\`\`\`

## ❌ BAD
\`\`\`typescript
// Bad example
\`\`\`
```

## 🎯 Benefits

- **Consistency**: Same patterns across the entire team
- **Onboarding**: New team members learn standards automatically
- **Context**: AI has project-specific knowledge in every conversation
- **Quality**: Fewer mistakes, better code reviews
- **Speed**: Less time explaining standards, more time coding

## 📚 Learn More

- [Cursor Rules Documentation](https://docs.cursor.com/context/rules-for-ai)
- Check the `create-rule` skill for more advanced patterns

## 🔄 Updating Rules

Rules can be updated anytime. Changes take effect in new conversations or when you explicitly reference the rule.

---

**Last Updated**: January 2026
**Maintained By**: Artemis Development Team
