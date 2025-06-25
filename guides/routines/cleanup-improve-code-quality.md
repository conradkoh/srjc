# Code Quality Cleanup Routine

## Overview

This document provides a systematic approach to improving code quality through proper organization, naming conventions, and documentation. This routine should be applied to TypeScript/JavaScript files in React, Next.js, and Convex backend projects.

## Core Principles

1. **Readability First**: Code must tell a story from top to bottom
2. **Intentional Organization**: Most important elements must be immediately visible
3. **Clear Boundaries**: Internal vs. external APIs must be obvious
4. **Self-Documenting**: Functions and interfaces must explain their purpose

## Cleanup Steps

### 0. Identify Files for Cleanup

Target only modified TypeScript/JavaScript files:

```bash
git status --porcelain | grep -E '\.(ts|tsx|js|jsx)$' | awk '{print $2}'
```

### 1. Add Comments to All Functions

**Every function requires a comment.**

```typescript
/**
 * Creates a new user account with the provided information.
 */
export async function createUser(userData: CreateUserRequest): Promise<string> {
  // Implementation
}

/**
 * Validates email format using regex pattern.
 * Internal helper function for user validation.
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

### 2. Prefix Internal Functions and Interfaces with Underscore

**All non-exported elements must be prefixed with `_`.**

```typescript
// Functions
function _validateInput(input: string): boolean { }

// Interfaces and Types
interface _UserState { }
type _ValidationResult = { };

// Constants
const _DEFAULT_TIMEOUT = 5000;
```

### 3. File Organization Structure

**Organize file contents in this exact order:**

```typescript
// 1. Imports (external first, then internal)
import React from 'react';
import { api } from '@/convex/_generated/api';

// 2. Public interfaces and types
export interface UserProfileProps { }
export type UserRole = 'admin' | 'user' | 'guest';

// 3. Internal interfaces and types (prefixed with _)
interface _UserState { }
type _ValidationResult = { };

// 4. Main exported functions/components
export function UserProfile({ userId }: UserProfileProps) { }
export async function createUser(userData: CreateUserRequest): Promise<string> { }

// 5. Internal helper functions (at bottom)
function _validateUserData(userData: CreateUserRequest): _ValidationResult { }
function _formatDisplayName(firstName: string, lastName: string): string { }
```

### 4. Replace `any` Types with Proper Types

**Eliminate all `any` usage.**

```typescript
// ❌ Never use any
function processData(data: any): any { }

// ✅ Always use specific types
interface DataItem {
  id: string;
  value: number;
}
function processData(data: DataItem[]): number[] { }

// ✅ Use unknown and type guards for API responses
function handleApiResponse(response: { data: unknown }) {
  if (isValidData(response.data)) {
    console.log(response.data);
  }
}

// ✅ Use specific event types
function handleClick(event: React.MouseEvent<HTMLButtonElement>) { }

// ✅ Use proper Convex context types
import { type MutationCtx, type QueryCtx } from './_generated/server';

export const getUser = async (ctx: QueryCtx, args: { userId: string }) => { };
export const createUser = async (ctx: MutationCtx, args: { name: string }) => { };
```

### 5. Prioritize High-Level Interfaces

**Place most important interfaces at the top in this order:**
1. Main entity interfaces
2. Component props interfaces  
3. API request/response interfaces
4. Internal interfaces (prefixed with `_`)

## React Performance Rules

### Use useCallback and useMemo

**Apply these hooks strategically:**

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

// ❌ Don't memoize primitive values or simple operations
const displayName = `${user.firstName} ${user.lastName}`; // String - no useMemo
const isAdult = user.age >= 18; // Boolean - no useMemo
const count = users.length; // Number - no useMemo
const isEmpty = !users.length; // Boolean - no useMemo
```

**useCallback Required For:**
- Functions passed as props to child components
- Functions used as dependencies in other hooks

**useMemo Required For:**
- Expensive calculations or data transformations
- Complex filtering, sorting, or data processing

**useMemo NOT Required For:**
- Primitive values (boolean, string, number)
- Simple property access or basic arithmetic
- Array.length or basic object property checks

## Quality Checklist

**Before marking a file complete, verify:**

### General
- [ ] All functions have descriptive comments
- [ ] Non-exported items prefixed with `_`
- [ ] Public interfaces at top, helpers at bottom
- [ ] File organization follows exact structure

### TypeScript
- [ ] Zero usage of `any` type
- [ ] Proper React event types
- [ ] Convex functions use `QueryCtx`/`MutationCtx`
- [ ] All parameters and returns explicitly typed

### React Performance  
- [ ] `useCallback` for props and hook dependencies
- [ ] `useMemo` for expensive operations only
- [ ] No unnecessary memoization of simple values

## Example: Before and After

### Before
```typescript
import React from 'react';

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function UserForm({ onSubmit }: UserFormProps) { }

interface UserFormProps {
  onSubmit: (data: FormData) => void;
}
```

### After
```typescript
import React from 'react';

/**
 * Props for the UserForm component.
 */
export interface UserFormProps {
  onSubmit: (data: FormData) => void;
}

/**
 * User registration form with validation and submission handling.
 */
export function UserForm({ onSubmit }: UserFormProps) {
  // Implementation using helper functions below
}

/**
 * Validates email format using regex pattern.
 * Internal helper function for form validation.
 */
function _validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}
```

This routine ensures code is maintainable, readable, and follows consistent patterns that make it easier for teams to collaborate and for AI agents to understand and work with the codebase.
