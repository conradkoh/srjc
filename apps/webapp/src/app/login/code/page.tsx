'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthState } from '@/modules/auth/AuthProvider';
import { LoginWithCode } from '@/modules/auth/LoginWithCode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function LoginCodePage() {
  const router = useRouter();
  const authState = useAuthState();

  // Check if user is authenticated
  const isAuthenticated = useMemo(() => {
    return authState?.state === 'authenticated';
  }, [authState]);

  // Redirect to app if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Login with Code</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the code from your other device to access your account
          </p>
        </div>

        <div className="mt-6">
          <LoginWithCode />
        </div>

        <div className="mt-6 text-center">
          <Link href="/login">
            <Button variant="ghost" size="sm" aria-label="Return to login page">
              Back to Login
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
