# Code Quality Cleanup Routine

## Overview

This document provides a systematic approach to improving code quality through proper organization, naming conventions, and documentation. This routine should be applied to TypeScript/JavaScript files in React, Next.js, and Convex backend projects.

## Core Principles

1. **Readability First**: Code should tell a story from top to bottom
2. **Intentional Organization**: Most important elements should be immediately visible
3. **Clear Boundaries**: Internal vs. external APIs should be obvious
4. **Self-Documenting**: Functions and interfaces should explain their purpose

## Cleanup Steps

### 1. Add Comments to All Functions

Every function must have a comment explaining its purpose, parameters, and return value.

#### For Exported Functions (Public API)
```typescript
/**
 * Creates a new user account with the provided information.
 * @param userData - The user registration data including name, email, and password
 * @returns Promise resolving to the created user ID
 */
export async function createUser(userData: CreateUserRequest): Promise<string> {
  // Implementation
}
```

#### For Internal Functions (Private)
```typescript
/**
 * Validates email format using regex pattern.
 * Internal helper function for user validation.
 */
function _validateEmail(email: string): boolean {
  // Implementation
}
```

#### For React Components
```typescript
/**
 * Displays a user's profile information with edit capabilities.
 * Shows name, email, and avatar with inline editing support.
 */
export function UserProfile({ userId }: UserProfileProps) {
  // Implementation
}
```

### 2. Prefix Internal Functions and Interfaces with Underscore

All non-exported functions, interfaces, types, and constants should be prefixed with `_` to clearly indicate they are internal to the module.

#### Functions
```typescript
// ❌ Bad - Internal function without prefix
function validateInput(input: string): boolean {
  return input.length > 0;
}

// ✅ Good - Internal function with prefix
function _validateInput(input: string): boolean {
  return input.length > 0;
}
```

#### Interfaces and Types
```typescript
// ❌ Bad - Internal interface without prefix
interface UserState {
  isLoading: boolean;
  error: string | null;
}

// ✅ Good - Internal interface with prefix
interface _UserState {
  isLoading: boolean;
  error: string | null;
}
```

#### Constants and Variables
```typescript
// ❌ Bad - Internal constant without prefix
const DEFAULT_TIMEOUT = 5000;

// ✅ Good - Internal constant with prefix
const _DEFAULT_TIMEOUT = 5000;
```

### 3. File Organization Structure

Organize file contents in the following order from top to bottom:

```typescript
// 1. Imports (external libraries first, then internal)
import React from 'react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

// 2. Public interfaces and types (exported)
export interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export type UserRole = 'admin' | 'user' | 'guest';

// 3. Internal interfaces and types (prefixed with _)
interface _UserState {
  isLoading: boolean;
  error: string | null;
}

type _ValidationResult = {
  isValid: boolean;
  errors: string[];
};

// 4. Main exported functions/components (entry points)
/**
 * Main user profile component for displaying and editing user information.
 */
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // Implementation using helper functions below
}

/**
 * Creates a new user with validation and error handling.
 */
export async function createUser(userData: CreateUserRequest): Promise<string> {
  // Implementation using helper functions below
}

// 5. Internal helper functions (closest to bottom)
/**
 * Validates user input data before submission.
 * Internal helper for createUser function.
 */
function _validateUserData(userData: CreateUserRequest): _ValidationResult {
  // Implementation
}

/**
 * Formats user display name for UI components.
 * Internal helper for UserProfile component.
 */
function _formatDisplayName(firstName: string, lastName: string): string {
  // Implementation
}
```

### 4. Replace `any` Types with Proper Types

Eliminate all usage of `any` type and replace with specific, well-defined types. The `any` type defeats the purpose of TypeScript and should be avoided.

#### Common `any` Replacements

```typescript
// ❌ Bad - Using any
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ Good - Using specific types
interface DataItem {
  id: string;
  value: number;
  label: string;
}

function processData(data: DataItem[]): number[] {
  return data.map((item: DataItem) => item.value);
}
```

#### For Unknown Data Structures
```typescript
// ❌ Bad - Using any for API responses
function handleApiResponse(response: any) {
  console.log(response.data);
}

// ✅ Good - Using unknown and type guards
interface ApiResponse {
  data: unknown;
  status: number;
}

function handleApiResponse(response: ApiResponse) {
  if (isValidData(response.data)) {
    console.log(response.data);
  }
}

function isValidData(data: unknown): data is { message: string } {
  return typeof data === 'object' && data !== null && 'message' in data;
}
```

#### For Event Handlers
```typescript
// ❌ Bad - Using any for events
function handleClick(event: any) {
  event.preventDefault();
}

// ✅ Good - Using specific event types
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}
```

### 5. High-Level Interfaces at the Top

The most important interfaces that define the module's public API should be placed immediately after imports and before any implementation.

#### Priority Order for Interfaces
1. **Main entity interfaces** (e.g., `User`, `Product`, `Order`)
2. **Component props interfaces** (e.g., `UserProfileProps`)
3. **API request/response interfaces** (e.g., `CreateUserRequest`)
4. **Configuration interfaces** (e.g., `DatabaseConfig`)
5. **Internal interfaces** (prefixed with `_`)

#### Example
```typescript
// High priority - Main entity
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// High priority - Component props
export interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

// Medium priority - API interfaces
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// Lower priority - Internal interfaces
interface _UserListState {
  selectedUser: User | null;
  isLoading: boolean;
}
```

## Application Guidelines

### When to Apply This Routine

1. **Before code reviews** - Clean up files before submitting for review
2. **When refactoring** - Apply these standards when modifying existing code
3. **New feature development** - Follow these patterns from the start
4. **Legacy code maintenance** - Gradually improve older files using this routine

### File Size Considerations

- **Small files (< 100 lines)**: Apply all rules strictly
- **Medium files (100-300 lines)**: Focus on public API organization and critical functions
- **Large files (> 300 lines)**: Consider splitting the file, but apply rules to the most important sections first

### Framework-Specific Notes

#### React Components
- Component props interfaces should be at the top
- Main component function should be early in the file
- Custom hooks should follow the main component
- Helper functions should be at the bottom

#### Convex Backend Functions
- Query/mutation functions should be at the top after interfaces
- Validation functions should be in the middle
- Utility functions should be at the bottom

#### Next.js Pages
- Page component should be the default export at the top
- Data fetching functions should follow
- Helper components should be at the bottom

## React-Specific Optimization Guidelines

### Use useCallback and useMemo for Performance

Apply `useCallback` and `useMemo` strategically to prevent unnecessary re-renders and expensive recalculations.

#### useCallback for Event Handlers

Use `useCallback` when passing functions as props to child components or when functions are dependencies in other hooks.

```typescript
// ❌ Bad - Function recreated on every render
export function UserList({ users }: UserListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleUserClick = (userId: string) => {
    setSelectedId(userId);
  };

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleUserClick} // New function instance every render
        />
      ))}
    </div>
  );
}

// ✅ Good - Function memoized with useCallback
export function UserList({ users }: UserListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleUserClick = useCallback((userId: string) => {
    setSelectedId(userId);
  }, []); // Empty dependency array since setSelectedId is stable

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleUserClick} // Same function instance across renders
        />
      ))}
    </div>
  );
}
```

#### useCallback with Dependencies

```typescript
// ✅ Good - useCallback with proper dependencies
export function SearchableUserList({ users, searchTerm }: SearchableUserListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleUserClick = useCallback((userId: string) => {
    setSelectedId(userId);
    // Log search context when user is selected
    console.log(`User selected with search term: ${searchTerm}`);
  }, [searchTerm]); // Include searchTerm in dependencies

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onClick={handleUserClick} />
      ))}
    </div>
  );
}
```

#### useMemo for Expensive Calculations

Use `useMemo` for computationally expensive operations or complex data transformations.

```typescript
// ❌ Bad - Expensive calculation on every render
export function UserAnalytics({ users }: UserAnalyticsProps) {
  const [filter, setFilter] = useState<UserRole>('all');

  // This expensive calculation runs on every render
  const analytics = users
    .filter(user => filter === 'all' || user.role === filter)
    .reduce((acc, user) => {
      // Complex analytics calculation
      return {
        totalUsers: acc.totalUsers + 1,
        averageAge: (acc.averageAge * acc.totalUsers + user.age) / (acc.totalUsers + 1),
        roleDistribution: {
          ...acc.roleDistribution,
          [user.role]: (acc.roleDistribution[user.role] || 0) + 1
        }
      };
    }, { totalUsers: 0, averageAge: 0, roleDistribution: {} });

  return <div>{/* Render analytics */}</div>;
}

// ✅ Good - Expensive calculation memoized
export function UserAnalytics({ users }: UserAnalyticsProps) {
  const [filter, setFilter] = useState<UserRole>('all');

  const analytics = useMemo(() => {
    return users
      .filter(user => filter === 'all' || user.role === filter)
      .reduce((acc, user) => {
        // Complex analytics calculation
        return {
          totalUsers: acc.totalUsers + 1,
          averageAge: (acc.averageAge * acc.totalUsers + user.age) / (acc.totalUsers + 1),
          roleDistribution: {
            ...acc.roleDistribution,
            [user.role]: (acc.roleDistribution[user.role] || 0) + 1
          }
        };
      }, { totalUsers: 0, averageAge: 0, roleDistribution: {} });
  }, [users, filter]); // Recalculate only when users or filter changes

  return <div>{/* Render analytics */}</div>;
}
```

#### useMemo for Derived Data

```typescript
// ✅ Good - Memoizing filtered and sorted data
export function UserTable({ users, searchTerm, sortBy }: UserTableProps) {
  const processedUsers = useMemo(() => {
    return users
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'email':
            return a.email.localeCompare(b.email);
          case 'created':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [users, searchTerm, sortBy]);

  return (
    <table>
      {processedUsers.map(user => (
        <UserRow key={user.id} user={user} />
      ))}
    </table>
  );
}
```

### When NOT to Use useCallback/useMemo

Don't overuse these hooks as they have their own overhead:

```typescript
// ❌ Bad - Unnecessary memoization for simple values
export function UserCard({ user }: UserCardProps) {
  // Don't memoize simple string concatenation
  const displayName = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName]);
  
  // Don't memoize simple calculations
  const isAdult = useMemo(() => user.age >= 18, [user.age]);
  
  return <div>{displayName}</div>;
}

// ✅ Good - Simple calculations without memoization
export function UserCard({ user }: UserCardProps) {
  const displayName = `${user.firstName} ${user.lastName}`;
  const isAdult = user.age >= 18;
  
  return <div>{displayName}</div>;
}
```

### React Performance Checklist

- [ ] Use `useCallback` for functions passed as props to child components
- [ ] Use `useCallback` for functions used as dependencies in other hooks
- [ ] Use `useMemo` for expensive calculations or data transformations
- [ ] Use `useMemo` for complex filtering, sorting, or data processing
- [ ] Avoid memoizing simple calculations or primitive values
- [ ] Include all dependencies in dependency arrays
- [ ] Consider React.memo for components that receive stable props

## Quality Checklist

Before considering a file "cleaned up", verify:

### General Code Quality
- [ ] All functions have descriptive comments
- [ ] Non-exported items are prefixed with `_`
- [ ] Public interfaces are at the top of the file
- [ ] Main entry points (exported functions/components) are near the top
- [ ] Helper functions are toward the bottom
- [ ] File tells a clear story from top to bottom
- [ ] Public API is immediately understandable
- [ ] Internal implementation details are clearly separated

### TypeScript Quality
- [ ] No usage of `any` type (replaced with proper types)
- [ ] Event handlers use specific React event types
- [ ] API responses use proper interfaces with type guards for unknown data
- [ ] All function parameters and return types are explicitly typed

### React Performance (if applicable)
- [ ] `useCallback` used for functions passed as props to child components
- [ ] `useCallback` used for functions that are dependencies in other hooks
- [ ] `useMemo` used for expensive calculations or data transformations
- [ ] Simple calculations are NOT unnecessarily memoized
- [ ] All dependencies are included in dependency arrays
- [ ] Consider `React.memo` for components with stable props

## Examples

### Before Cleanup
```typescript
import React from 'react';

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function UserForm({ onSubmit }: UserFormProps) {
  // Component implementation
}

interface UserFormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
}

function formatName(first: string, last: string) {
  return `${first} ${last}`;
}
```

### After Cleanup
```typescript
import React from 'react';

/**
 * Props for the UserForm component.
 */
export interface UserFormProps {
  onSubmit: (data: FormData) => void;
}

/**
 * Form data structure for user registration.
 */
export interface FormData {
  name: string;
  email: string;
}

/**
 * User registration form with validation and submission handling.
 * Validates email format and formats user names before submission.
 */
export function UserForm({ onSubmit }: UserFormProps) {
  // Component implementation using helper functions below
}

/**
 * Validates email format using regex pattern.
 * Internal helper function for form validation.
 */
function _validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Formats user's full name from first and last name components.
 * Internal helper function for name processing.
 */
function _formatName(first: string, last: string): string {
  return `${first} ${last}`;
}
```

This routine ensures code is maintainable, readable, and follows consistent patterns that make it easier for teams to collaborate and for AI agents to understand and work with the codebase.
