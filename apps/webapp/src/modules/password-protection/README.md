# Password Protection Module

A client-side password protection utility for React components that allows you to protect content with a password without requiring server-side authentication.

## Overview

This module provides a simple way to password-protect any React component or content. It uses SHA-256 hashing with the Web Crypto API for secure password verification while keeping everything client-side. The module includes localStorage persistence to remember valid passwords across browser sessions.

## Features

- 🔒 **Client-side password protection** - No server required
- 🔐 **SHA-256 hashing** - Secure password verification using Web Crypto API
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
window.generatePasswordHash('your-secret-password')
```

This will return a hash like: `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`

### 2. Protect Your Content

```tsx
import { PasswordProtect } from '@/modules/password-protection';

export default function MyProtectedPage() {
  return (
    <div>
      <h1>My App</h1>
      
      <PasswordProtect 
        verifyHash="ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
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
| `localStorageKey` | `string` | ✅ | - | The localStorage key to store/retrieve the password |
| `children` | `React.ReactNode` | ✅ | - | The content to protect |
| `title` | `string` | ❌ | `"Protected Content"` | Title shown on the password form |
| `description` | `string` | ❌ | `"Please enter the password to view this content."` | Description shown on the password form |

#### Example with Custom Title and Description

```tsx
<PasswordProtect 
  verifyHash="your-hash-here"
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

#### `generatePasswordHash(password: string): Promise<string>`

Generates a SHA-256 hash of the provided password.

```tsx
import { generatePasswordHash } from '@/modules/password-protection';

const hash = await generatePasswordHash('my-password');
console.log(hash); // "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
```

#### `verifyPassword(password: string, hash: string): Promise<boolean>`

Verifies a password against a hash.

```tsx
import { verifyPassword } from '@/modules/password-protection';

const isValid = await verifyPassword('my-password', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');
console.log(isValid); // true or false
```

## Usage Examples

### Basic Protection

```tsx
import { PasswordProtect } from '@/modules/password-protection';

function SecretPage() {
  return (
    <PasswordProtect 
      verifyHash="your-hash-here"
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
        localStorageKey="admin-panel-password"
        title="Admin Panel"
        description="Admin access required"
      >
        <AdminDashboard />
      </PasswordProtect>

      <PasswordProtect 
        verifyHash="hash-for-section-2"
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