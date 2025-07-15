# Code Quality Cleanup Routine

## Overview

This document provides a systematic step-by-step approach to improving code quality for individual TypeScript/JavaScript files in React, Next.js, and Convex backend projects. Follow these steps in order for each file you're cleaning up.

## Core Principles

1. **Readability First**: Code must tell a story from top to bottom
2. **Intentional Organization**: Most important elements must be immediately visible
3. **Clear Boundaries**: Internal vs. external APIs must be obvious
4. **Self-Documenting**: Functions and interfaces must explain their purpose

## Step-by-Step File Cleanup Process

### Step 0: Identify Target Files

Target only modified TypeScript/JavaScript files:

```bash
git status --porcelain | grep -E '\.(ts|tsx|js|jsx)$' | awk '{print $2}'
```

**For each file, follow steps 1-7 in order:**

### Step 1: Add Comments to All Functions

**Action**: Add a descriptive comment above every function (exported and internal).

**What to do:**

- Place a comment directly above each function declaration
- Describe what the function does, not how it does it
- Use present tense ("Creates", "Validates", "Displays")
- Note: Internal functions should already have `_` prefix (see Step 2)

```typescript
/**
 * Creates a new user account with the provided information.
 */
export async function createUser(userData: CreateUserRequest): Promise<string> {
  // Implementation
}

/**
 * Validates email format using regex pattern.
 */
function _validateEmail(email: string): boolean {
  // Implementation
}

/**
 * Displays a user's profile information with edit capabilities.
 */
export function UserProfile({ userId }: UserProfileProps) {
  // Implementation
}
```

### Step 2: Prefix Internal Elements with Underscore

**Action**: Add `_` prefix to all non-exported functions, interfaces, types, and constants.

**What to do:**

- Scan through the file for any function, interface, type, or constant that is NOT exported
- Add `_` prefix to the name
- Update all references to use the new prefixed name

```typescript
// Functions
function _validateInput(input: string): boolean {}

// Interfaces and Types
interface _UserState {}
type _ValidationResult = {};

// Constants
const _DEFAULT_TIMEOUT = 5000;
```

### Step 3: Eliminate All `any` Types

**Action**: Replace every instance of `any` with proper types.

**What to do:**

- Search for all occurrences of `any` in the file
- Replace with specific interfaces, types, or `unknown` with type guards
- Use proper React event types and Convex context types

```typescript
// ❌ Replace this
function processData(data: any): any {}

// ✅ With this
interface DataItem {
  id: string;
  value: number;
}
function processData(data: DataItem[]): number[] {}

// ✅ Use proper event types
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {}

// ✅ Use proper Convex context types
import { type MutationCtx, type QueryCtx } from "./_generated/server";
```

### Step 4: Reorganize File Structure

**Action**: Rearrange the entire file contents in this exact order.

**What to do:**

1. Move all imports to the top (external libraries first, then internal imports)
2. Move all exported interfaces and types to the top (after imports)
3. Move all internal interfaces and types (prefixed with `_`) next
4. Move all exported functions/components next
5. Move all internal helper functions to the bottom

```typescript
// 1. Imports (external first, then internal)
import React from "react";
import { api } from "@/convex/_generated/api";

// 2. Public interfaces and types
export interface UserProfileProps {}
export type UserRole = "admin" | "user" | "guest";

// 3. Internal interfaces and types (prefixed with _)
interface _UserState {}
type _ValidationResult = {};

// 4. Main exported functions/components
export function UserProfile({ userId }: UserProfileProps) {}
export async function createUser(
  userData: CreateUserRequest
): Promise<string> {}

// 5. Internal helper functions (at bottom)
function _validateUserData(userData: CreateUserRequest): _ValidationResult {}
function _formatDisplayName(firstName: string, lastName: string): string {}
```

### Step 5: Apply React Performance Optimizations

**Action**: Add `useCallback` and `useMemo` where appropriate.

**What to do:**

- Wrap functions passed as props in `useCallback`
- Wrap functions used as dependencies in other hooks in `useCallback`
- Wrap expensive calculations in `useMemo`
- **Do NOT** wrap primitive values or simple operations

```typescript
// ✅ Use useCallback for functions passed as props
const handleUserClick = useCallback((userId: string) => {
  setSelectedId(userId);
}, []);

// ✅ Use useMemo for expensive calculations
const analytics = useMemo(() => {
  return users.reduce((acc, user) => {
    // Complex calculation
  }, {});
}, [users, filter]);

// ❌ Don't memoize these
const displayName = `${user.firstName} ${user.lastName}`; // String - no useMemo
const isAdult = user.age >= 18; // Boolean - no useMemo
const count = users.length; // Number - no useMemo
```

### Step 6: Final Quality Check

**Action**: Verify the file meets all quality standards.

**Checklist for each file:**

**General Structure:**

- [ ] All functions have descriptive comments
- [ ] All non-exported items are prefixed with `_`
- [ ] File follows the exact organization structure (imports → public types → internal types → exported functions → internal functions)

**TypeScript Quality:**

- [ ] Zero usage of `any` type anywhere in the file
- [ ] All React event handlers use proper event types
- [ ] All Convex functions use `QueryCtx`/`MutationCtx` types
- [ ] All function parameters and return types are explicitly typed

**React Performance:**

- [ ] Functions passed as props are wrapped in `useCallback`
- [ ] Functions used as hook dependencies are wrapped in `useCallback`
- [ ] Expensive calculations are wrapped in `useMemo`
- [ ] Simple values (strings, booleans, numbers) are NOT memoized

### Step 7: Clean Up Unused Files

**Action**: Identify and remove files that are no longer referenced in the codebase.

**What to do:**

1. **Look at the file name** - understand what the file is supposed to do
2. **Search for references** - be very careful to ensure that the folder paths are the same as well
   - Search for the exact file name (without extension)
   - Search for the full relative path from project root
   - Search for import statements that reference this file
   - Check for dynamic imports or require statements
3. **Delete the file** if it is not used anywhere in the codebase

**CRITICAL: Files to NEVER delete**
Before proceeding with any file deletion, verify the file is NOT one of these protected types:

**Configuration Files:**

- `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- `tsconfig.json`, `tsconfig.*.json`
- `next.config.js`, `next.config.ts`, `next.config.mjs`
- `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`
- `biome.json`, `.eslintrc.*`, `.prettierrc.*`
- `vite.config.*`, `webpack.config.*`, `rollup.config.*`
- `.env*`, `.env.local`, `.env.production`, etc.
- `nx.json`, `project.json`, `workspace.json`

**Entry Point Files:**

- `index.ts`, `index.tsx`, `index.js`, `index.jsx`
- `main.ts`, `main.tsx`, `main.js`, `main.jsx`
- `app.ts`, `app.tsx`, `app.js`, `app.jsx`
- `server.ts`, `server.tsx`, `server.js`, `server.jsx`

**Generated Files:**

- Files in `_generated/` directories
- Files in `node_modules/` directories
- Files in `.next/`, `dist/`, `build/`, `out/` directories
- Files with `.d.ts` extensions (TypeScript declaration files)
- Files in `convex/_generated/` directories

**Framework-Specific Files:**

- `page.tsx`, `page.ts`, `page.js`, `page.jsx` (Next.js App Router)
- `layout.tsx`, `layout.ts`, `layout.js`, `layout.jsx` (Next.js App Router)
- `loading.tsx`, `loading.ts`, `loading.js`, `loading.jsx` (Next.js App Router)
- `error.tsx`, `error.ts`, `error.js`, `error.jsx` (Next.js App Router)
- `not-found.tsx`, `not-found.ts`, `not-found.js`, `not-found.jsx` (Next.js App Router)
- `route.ts`, `route.tsx`, `route.js`, `route.jsx` (Next.js API routes)
- `middleware.ts`, `middleware.js` (Next.js middleware)
- `manifest.ts`, `manifest.js` (PWA manifests)
- `sitemap.ts`, `sitemap.js` (SEO files)
- `robots.ts`, `robots.js` (SEO files)

**Search commands to use:**

```bash
# Search for file name (without extension)
grep -r "filename" . --exclude-dir=node_modules --exclude-dir=.git

# Search for full relative path
grep -r "path/to/filename" . --exclude-dir=node_modules --exclude-dir=.git

# Search for import statements
grep -r "import.*filename" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "from.*filename" . --exclude-dir=node_modules --exclude-dir=.git

# Search for dynamic imports
grep -r "import(" . --exclude-dir=node_modules --exclude-dir=.git | grep "filename"
```

**Important considerations:**

- Check for files that might be referenced in configuration files (package.json, tsconfig.json, etc.)
- Verify that the file isn't used in build scripts or deployment configurations
- Ensure the file isn't referenced in documentation or README files
- Double-check that the file isn't used in test files or test configurations
- **NEVER delete files in protected directories or with protected names**

**Checklist for unused file cleanup:**

- [ ] File name has been identified and understood
- [ ] **VERIFIED file is NOT a protected configuration, entry point, generated, or framework file**
- [ ] Searched for exact file name references (without extension)
- [ ] Searched for full relative path references
- [ ] Searched for import statements referencing this file
- [ ] Searched for dynamic imports or require statements
- [ ] Checked configuration files for references
- [ ] Verified file is not used in build/deployment scripts
- [ ] Confirmed file is not referenced in documentation
- [ ] **Double-checked that file is not in a protected directory or has a protected name**
- [ ] File has been safely deleted (if unused)

## Complete Example: Before and After

### Before Cleanup

```typescript
import React from "react";

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function UserForm({ onSubmit }: UserFormProps) {
  const handleSubmit = (data: any) => {
    if (validateEmail(data.email)) {
      onSubmit(data);
    }
  };
  return <form onSubmit={handleSubmit}>...</form>;
}

interface UserFormProps {
  onSubmit: (data: FormData) => void;
}
```

### After Cleanup (Following All 7 Steps)

```typescript
// 1. Imports
import React, { useCallback } from "react";

// 2. Public interfaces
export interface UserFormProps {
  onSubmit: (data: FormData) => void;
}

// 3. Internal types
interface _FormData {
  email: string;
  name: string;
}

// 4. Exported components
/**
 * User registration form with validation and submission handling.
 */
export function UserForm({ onSubmit }: UserFormProps) {
  /**
   * Handles form submission with email validation.
   */
  const handleSubmit = useCallback(
    (data: _FormData) => {
      if (_validateEmail(data.email)) {
        onSubmit(data);
      }
    },
    [onSubmit]
  );

  return <form onSubmit={handleSubmit}>...</form>;
}

// 5. Internal helper functions
/**
 * Validates email format using regex pattern.
 */
function _validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}
```

## Usage Instructions

1. **Select a file** from your git status that needs cleanup
2. **Work through steps 1-7** in exact order for that file
3. **Complete the checklist** in Step 6 before moving to the next file
4. **Perform unused file cleanup** in Step 7 for any files that appear to be unused
5. **Repeat** for each file that needs cleanup

This step-by-step approach ensures consistent, high-quality code that is maintainable and follows team standards.
