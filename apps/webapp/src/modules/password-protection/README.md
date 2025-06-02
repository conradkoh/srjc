# Password Protection Module

A client-side password protection utility for React components that allows you to protect content with a password without requiring server-side authentication.

## Overview

This module provides a simple way to password-protect any React component or content. It uses SHA-256 hashing with salt to prevent rainbow table attacks, using the Web Crypto API for secure password verification while keeping everything client-side. The module includes localStorage persistence to remember valid passwords across browser sessions.

## Features

- 🔒 **Client-side password protection** - No server required
- 🔐 **SHA-256 hashing with salt** - Secure password verification with protection against rainbow table attacks
- 💾 **localStorage persistence** - Remembers valid passwords across sessions
- 🎨 **Beautiful UI** - Built with Shadcn UI components
- 👁️ **Password visibility toggle** - Show/hide password functionality
- ⚡ **Loading states** - Proper UX with loading indicators
- 🚨 **Error handling** - User-friendly error messages
- 📱 **Responsive design** - Works on all screen sizes
- 🔧 **TypeScript support** - Fully typed for better DX

## Installation

The module is already included in this project. No additional installation required.

## Quick Start

### 1. Generate a Password Hash

Open your browser's developer console and run:

```javascript
window.generatePasswordHash('your-secret-password', 'your-unique-salt')
```

This will return a hash like: `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`

**Important**: Use a unique salt for each protected component to ensure maximum security.

### 2. Protect Your Content

```tsx
import { PasswordProtect } from '@/modules/password-protection';

export default function MyProtectedPage() {
  return (
    <div>
      <h1>My App</h1>
      
      <PasswordProtect 
        verifyHash="ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
        salt="my-unique-salt-string"
        localStorageKey="my-protected-content-password"
      >
        <div>
          <h2>Secret Content</h2>
          <p>This content is only visible after entering the correct password!</p>
        </div>
      </PasswordProtect>
    </div>
  );
}
```

## API Reference

### `PasswordProtect` Component

The main component that wraps your protected content.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `verifyHash` | `string` | ✅ | - | The SHA-256 hash to verify the password against |
| `salt` | `string` | ✅ | - | The salt used for password hashing |
| `localStorageKey` | `string` | ✅ | - | The localStorage key to store/retrieve the password |
| `children` | `React.ReactNode` | ✅ | - | The content to protect |
| `title` | `string` | ❌ | `"Protected Content"` | Title shown on the password form |
| `description` | `string` | ❌ | `"Please enter the password to view this content."` | Description shown on the password form |

#### Example with Custom Title and Description

```tsx
<PasswordProtect 
  verifyHash="your-hash-here"
  salt="admin-panel-salt"
  localStorageKey="admin-panel-password"
  title="Confidential Documents"
  description="Enter the access code to view these documents."
>
  <YourProtectedContent />
</PasswordProtect>
```

## localStorage Persistence

The component automatically handles password persistence using localStorage:

### How it works

1. **On mount**: Checks if a password is stored in localStorage using the provided `localStorageKey`
2. **Validation**: If a stored password exists, it's verified against the `verifyHash`
3. **Auto-unlock**: If the stored password is valid, the content is automatically unlocked
4. **Cleanup**: Invalid or corrupted stored passwords are automatically removed
5. **Storage**: When a user enters a correct password, it's stored in localStorage for future visits

### Storage Keys

Each protected component should use a unique `localStorageKey` to avoid conflicts:

```tsx
// Good: Unique keys for different protected areas
<PasswordProtect 
  verifyHash="hash1" 
  localStorageKey="admin-dashboard-password"
>
  <AdminDashboard />
</PasswordProtect>

<PasswordProtect 
  verifyHash="hash2" 
  localStorageKey="financial-reports-password"
>
  <FinancialReports />
</PasswordProtect>
```

### Clearing Stored Passwords

To manually clear a stored password, you can use the browser's developer console:

```javascript
// Clear a specific password
localStorage.removeItem('your-storage-key');

// Clear all localStorage (use with caution)
localStorage.clear();
```

## Utility Functions

#### `generatePasswordHash(password: string, salt: string): Promise<string>`

Generates a SHA-256 hash of the provided password with salt protection.

```tsx
import { generatePasswordHash } from '@/modules/password-protection';

const hash = await generatePasswordHash('my-password', 'my-unique-salt');
console.log(hash); // "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
```

**Error Handling:**
- Throws an error if password is empty or not a string
- Throws an error if salt is empty or not a string
- Provides clear error messages to guide proper usage

```tsx
// This will throw an error
try {
  await generatePasswordHash('password', ''); // Error: Salt is required
} catch (error) {
  console.error(error.message); // "Salt is required and must be a non-empty string. Please provide a unique salt for security."
}
```

#### `verifyPassword(password: string, hash: string, salt: string): Promise<boolean>`

Verifies a password against a hash using the provided salt.

```tsx
import { verifyPassword } from '@/modules/password-protection';

const isValid = await verifyPassword('my-password', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'my-unique-salt');
console.log(isValid); // true or false
```

**Error Handling:**
- Returns `false` if any parameter is invalid (logs error to console)
- Validates all input parameters before processing
- Gracefully handles validation errors without throwing

## Console Usage

When using the password hash generator in the browser console:

```javascript
// Correct usage
window.generatePasswordHash('my-password', 'my-salt')

// This will throw an error with helpful message
window.generatePasswordHash('my-password') // Error: Both password and salt are required
```

The console function provides clear usage instructions when called incorrectly.

## Usage Examples

### Basic Protection

```tsx
import { PasswordProtect } from '@/modules/password-protection';

function SecretPage() {
  return (
    <PasswordProtect 
      verifyHash="your-hash-here"
      salt="secret-page-salt"
      localStorageKey="secret-page-password"
    >
      <div className="p-6">
        <h1>Secret Information</h1>
        <p>This is protected content!</p>
      </div>
    </PasswordProtect>
  );
}
```

### Protecting Part of a Page

```tsx
import { PasswordProtect } from '@/modules/password-protection';

function MixedContentPage() {
  return (
    <div>
      {/* Public content */}
      <header>
        <h1>Welcome to My Site</h1>
        <p>This content is visible to everyone.</p>
      </header>

      {/* Protected content */}
      <PasswordProtect 
        verifyHash="your-hash-here"
        salt="members-section-salt"
        localStorageKey="members-section-password"
      >
        <section className="mt-8">
          <h2>Members Only</h2>
          <p>This section requires a password to view.</p>
        </section>
      </PasswordProtect>
    </div>
  );
}
```

### Multiple Protected Sections

```tsx
import { PasswordProtect } from '@/modules/password-protection';

function MultiProtectedPage() {
  return (
    <div className="space-y-8">
      <PasswordProtect 
        verifyHash="hash-for-section-1"
        salt="admin-panel-salt"
        localStorageKey="admin-panel-password"
        title="Admin Panel"
        description="Admin access required"
      >
        <AdminDashboard />
      </PasswordProtect>

      <PasswordProtect 
        verifyHash="hash-for-section-2"
        salt="financial-data-salt"
        localStorageKey="financial-data-password"
        title="Financial Data"
        description="Finance team access required"
      >
        <FinancialReports />
      </PasswordProtect>
    </div>
  );
}
```

## Salt Best Practices

### 1. **Use Unique Salts**
Each protected component should use a unique salt to maximize security:

```tsx
// Good: Different salts for different content
<PasswordProtect salt="admin-dashboard-2024" ... />
<PasswordProtect salt="financial-reports-v2" ... />

// Avoid: Reusing the same salt
<PasswordProtect salt="my-salt" ... />
<PasswordProtect salt="my-salt" ... />
```

### 2. **Salt Recommendations**
- Use descriptive, unique strings
- Include version numbers or dates if content changes
- Keep salts consistent for the same content across deployments
- Store salts securely (they can be in your source code as they're not secret)

### 3. **Example Salt Patterns**
```tsx
// By content type and version
salt="admin-panel-v1"
salt="user-data-2024"
salt="financial-reports-q1-2024"

// By feature and environment
salt="beta-features-staging"
salt="premium-content-prod"
```

## Security Considerations

### ⚠️ Important Security Notes

1. **Client-side only**: This is a client-side protection mechanism. The hash and protected content are still sent to the browser.

2. **Not for highly sensitive data**: This should not be used for protecting truly sensitive information that requires server-side security.

3. **Hash visibility**: The hash is visible in your source code, so anyone with access to the code can potentially brute-force the password.

4. **Use cases**: Best suited for:
   - Protecting content from casual viewing
   - Adding a simple access layer to internal tools
   - Hiding content that's not meant for general audiences
   - Creating "members-only" sections with shared passwords

### Best Practices

1. **Use strong passwords**: Choose passwords that are difficult to guess
2. **Rotate passwords**: Change passwords periodically
3. **Limit scope**: Only protect content that doesn't require high security
4. **Consider alternatives**: For truly sensitive data, use proper server-side authentication

## Styling and Customization

The component uses Shadcn UI components and can be customized through:

1. **CSS classes**: The component respects your Tailwind CSS theme
2. **Theme variables**: Uses CSS custom properties for colors
3. **Component props**: Customize title and description text

### Custom Styling Example

```tsx
<div className="my-custom-container">
  <PasswordProtect 
    verifyHash="your-hash"
    title="🔐 Secure Area"
    description="This area contains confidential information."
  >
    <div className="custom-protected-content">
      {/* Your content */}
    </div>
  </PasswordProtect>
</div>
```

## Troubleshooting

### Common Issues

1. **Hash not working**: Make sure you're using the exact hash generated by `window.generatePasswordHash()`
2. **Import errors**: Ensure you're importing from `@/modules/password-protection`
3. **Console function not available**: The `window.generatePasswordHash` function is only available in the browser

### Debug Mode

You can enable debug logging by opening the browser console and checking for any error messages during password verification.

## Browser Compatibility

This module uses the Web Crypto API, which is supported in:
- Chrome 37+
- Firefox 34+
- Safari 7+
- Edge 12+

## Contributing

When contributing to this module:

1. Maintain TypeScript types
2. Follow the existing code style
3. Test in multiple browsers
4. Update this README if adding new features

## License

This module is part of the larger project and follows the same license terms. 