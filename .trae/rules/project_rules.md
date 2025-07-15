# Project Rules

This document compiles all the development rules and conventions for the Next.js Convex Starter App project.

## Package Manager

We use **pnpm** as our package manager. This is a pnpm workspace with multiple packages:

- `apps/webapp` - frontend project
- `services/backend` - backend project

## Code Quality & Linting

### Linting

We use **Biome** for checking lints. This can be run from the root of the repo with `pnpm run lint`.

**IMPORTANT:**

- AVOID running linting with the next lint command
- AVOID running linting with eslint

### Clean up code after generations

The code can be improved by following the clean up routine in [cleanup-improve-code-quality.md](guides/routines/cleanup-improve-code-quality.md)

## Frontend Development

The location of the frontend project is in `apps/webapp`.

### IMPORTANT RULES

- **NEVER** run the `dev` command to start the dev server unless explicitly told to do so
- **NEVER** run the `build` command to test the app and prefer to rely on running tests and typechecks instead

### UI Design - Components & Icons

This project uses the following libraries:

- **Components:** ShadCN
- **Icons:**
  - @radix-ui/react-icons
  - lucide-react
  - react-icons

#### ShadCN

- When adding a new component, use the command format `npx shadcn@latest add <component-name>`
- **ALWAYS** run the shadcn component add command from within the webapp folder at `apps/webapp`

### Next.js

In the latest Next.js app router, the `params` prop for top-level pages is now passed in as a **Promise**. This means you must `await` the params before using them in your page components.

#### Example

```ts
// Always destructure and use `await params` in your top-level page components.
export default async function MyComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>{id}</div>;
}
```
