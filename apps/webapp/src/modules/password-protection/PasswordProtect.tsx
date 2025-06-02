'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  EyeIcon,
  EyeOffIcon,
  EyeOffIcon as HideIcon,
  LockIcon,
  MoreVerticalIcon,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { verifyPassword } from './password-utils';

export interface PasswordProtectProps {
  verifyHash: string;
  salt: string;
  localStorageKey: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function PasswordProtect({
  verifyHash,
  salt,
  localStorageKey,
  children,
  title = 'Protected Content',
  description = 'Please enter the password to view this content.',
}: PasswordProtectProps) {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check localStorage on mount for existing valid password
  useEffect(() => {
    const checkStoredPassword = async () => {
      try {
        const storedPassword = localStorage.getItem(localStorageKey);
        if (storedPassword) {
          const isValid = await verifyPassword(storedPassword, verifyHash, salt);
          if (isValid) {
            setIsVerified(true);
          } else {
            // Remove invalid stored password
            localStorage.removeItem(localStorageKey);
          }
        }
      } catch (err) {
        console.error('Error checking stored password:', err);
        // Remove potentially corrupted stored password
        localStorage.removeItem(localStorageKey);
      } finally {
        setIsCheckingStorage(false);
      }
    };

    checkStoredPassword();
  }, [localStorageKey, verifyHash, salt]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const isValid = await verifyPassword(password, verifyHash, salt);
        if (isValid) {
          // Store the password in localStorage
          localStorage.setItem(localStorageKey, password);
          setIsVerified(true);
          setPassword(''); // Clear password from memory
        } else {
          setError('Incorrect password. Please try again.');
        }
      } catch (err) {
        setError('An error occurred while verifying the password.');
        console.error('Password verification error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [password, verifyHash, salt, localStorageKey]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (error) setError(''); // Clear error when user starts typing
    },
    [error]
  );

  const handleTemporaryHide = useCallback(() => {
    setIsTemporarilyHidden(true);
  }, []);

  const handleLock = useCallback(() => {
    localStorage.removeItem(localStorageKey);
    setIsVerified(false);
    setIsTemporarilyHidden(false);
  }, [localStorageKey]);

  const handleUnhide = useCallback(() => {
    setIsTemporarilyHidden(false);
  }, []);

  // Show loading state while checking localStorage
  if (isCheckingStorage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary" />
            <LockIcon className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">Checking authentication...</p>
            <p className="text-xs text-muted-foreground">Please wait while we verify your access</p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="relative">
        {/* Action Menu */}
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
              >
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleTemporaryHide} className="cursor-pointer">
                <HideIcon className="mr-2 h-4 w-4" />
                Hide temporarily
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLock} className="cursor-pointer text-destructive">
                <LockIcon className="mr-2 h-4 w-4" />
                Lock content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div
          className={`transition-all duration-300 ${
            isTemporarilyHidden ? 'blur-md select-none pointer-events-none' : ''
          }`}
        >
          {children}
        </div>

        {/* Unhide overlay when temporarily hidden */}
        {isTemporarilyHidden && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
            <Button
              onClick={handleUnhide}
              variant="secondary"
              size="sm"
              className="bg-background/90 backdrop-blur-sm border border-border/50"
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Show content
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <LockIcon className="h-6 w-6" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  disabled={isLoading}
                  className={error ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !password.trim()}>
              {isLoading ? 'Verifying...' : 'Unlock Content'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
