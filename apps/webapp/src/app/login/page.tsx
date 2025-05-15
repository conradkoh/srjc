'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnonymousLoginButton } from '@/modules/auth/AnonymousLoginButton';
import { useAuthState } from '@/modules/auth/AuthProvider';
import { KeyRound, KeySquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const authState = useAuthState();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const isLoading = authState === undefined;

  // Get session ID for anonymous login - moved to useEffect to avoid hydration mismatch
  useEffect(() => {
    setSessionId(localStorage.getItem('sessionId'));
  }, []);

  // Redirect authenticated users to app
  useEffect(() => {
    if (authState?.state === 'authenticated') {
      router.push('/app');
    }
  }, [authState, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500">Choose a login method to continue</p>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold">Login with Code</h3>
                <p className="text-sm text-gray-500">Use a code from your other device</p>
              </div>
              <Link href="/login/code">
                <Button className="w-full" aria-label="Go to login with code page">
                  <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                  Enter Login Code
                </Button>
              </Link>
            </div>
          </Card>

          {sessionId && (
            <div className="pt-2">
              <AnonymousLoginButton sessionId={sessionId} />
            </div>
          )}

          {/* Recovery link - subtle version */}
          <div className="pt-6 text-center">
            <Link
              href="/recover"
              className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Recover your anonymous account"
            >
              <KeySquare className="mr-1 h-3 w-3" aria-hidden="true" />
              Lost access to your anonymous account?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
