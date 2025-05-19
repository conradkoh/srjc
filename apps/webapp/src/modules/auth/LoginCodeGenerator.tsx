'use client';

import { Button } from '@/components/ui/button';
import { api } from '@workspace/backend/convex/_generated/api';
import { formatLoginCode } from '@workspace/backend/modules/auth/codeUtils';
import { useSessionMutation, useSessionQuery } from 'convex-helpers/react/sessions';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from './AuthProvider';

export function LoginCodeGenerator() {
  const authState = useAuthState();
  const createLoginCode = useSessionMutation(api.auth.createLoginCode);
  const activeCodeQuery = useSessionQuery(api.auth.getActiveLoginCode);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loginCode, setLoginCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // Function to calculate time remaining
  const getTimeRemaining = useCallback((): string => {
    if (!expiresAt) return '';

    const timeLeft = Math.max(0, expiresAt - Date.now());
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [expiresAt]);

  const [timeRemaining, setTimeRemaining] = useState<string>(getTimeRemaining());

  // Keep login code synced with active code from backend
  useEffect(() => {
    if (!activeCodeQuery) return;

    if (activeCodeQuery.success && activeCodeQuery.code && activeCodeQuery.expiresAt) {
      // We have an active code
      if (loginCode !== activeCodeQuery.code) {
        setLoginCode(activeCodeQuery.code);
        setExpiresAt(activeCodeQuery.expiresAt);
      }
    } else {
      // No active code or code was consumed
      if (loginCode) {
        setLoginCode(null);
        setExpiresAt(null);

        // Only show notification if we had a code before
        if (activeCodeQuery.reason === 'no_active_code') {
          toast.info('Your login code was used or has expired');
        }
      }
    }
  }, [activeCodeQuery, loginCode]);

  // Update timer every second
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);

      // If expired, clear the code
      if (remaining === '0:00') {
        clearInterval(interval);
        setLoginCode(null);
        setExpiresAt(null);
        toast.info('Your login code has expired');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, getTimeRemaining]);

  const handleGenerateCode = useCallback(async () => {
    if (authState?.state !== 'authenticated') {
      toast.error('You must be logged in to generate a login code');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await createLoginCode();
      if (result.success) {
        setLoginCode(result.code);
        setExpiresAt(result.expiresAt);
        setTimeRemaining(getTimeRemaining());
        toast.success('Login code generated successfully');
      } else {
        toast.error('Failed to generate login code');
      }
    } catch (error) {
      console.error('Error generating login code:', error);
      toast.error('An error occurred while generating login code');
    } finally {
      setIsGenerating(false);
    }
  }, [authState?.state, createLoginCode, getTimeRemaining]);

  // Conditionally render based on authentication state
  const isAnonymousUser = useMemo(() => {
    return (
      authState?.state === 'authenticated' &&
      'user' in authState &&
      authState.user.type === 'anonymous'
    );
  }, [authState]);

  // Early return if not an anonymous authenticated user
  if (!isAnonymousUser) {
    return null;
  }

  // Memoize the button text
  const buttonText = useMemo(() => {
    if (isGenerating) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Generating...</span>
        </>
      );
    }
    return loginCode ? 'Generate New Code' : 'Generate Login Code';
  }, [isGenerating, loginCode]);

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Use Your Account on Another Device</h3>
        <p className="text-sm text-muted-foreground">
          Generate a temporary login code to access your anonymous account from another device
        </p>
      </div>

      <div className="p-6">
        {loginCode ? (
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Your login code:</p>
              <p className="text-3xl font-mono font-bold tracking-wider" aria-live="polite">
                {formatLoginCode(loginCode)}
              </p>
              <p className="text-sm text-muted-foreground mt-2" aria-live="polite">
                Valid for {timeRemaining}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Enter this code on the login page of your other device to access your account.</p>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm space-y-2">
            <p>
              Generate a temporary login code that allows you to access your anonymous account from
              another device. The code will be valid for 1 minute.
            </p>
            <p>
              <strong>Note:</strong> This will invalidate any previously generated codes.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-secondary/50 border-t flex justify-end">
        <Button
          onClick={handleGenerateCode}
          disabled={isGenerating}
          aria-busy={isGenerating}
          aria-label={loginCode ? 'Generate a new login code' : 'Generate a login code'}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
