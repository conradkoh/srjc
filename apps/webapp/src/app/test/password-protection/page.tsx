import { PasswordProtect } from '@/modules/password-protection';

export default function PasswordDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Password Protection Module Demo</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">How to use:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Open your browser's developer console (F12)</li>
            <li>
              Run:{' '}
              <code className="bg-muted px-2 py-1 rounded">
                window.generatePasswordHash('your-secret-password')
              </code>
            </li>
            <li>Copy the returned hash</li>
            <li>
              Use the hash in the <code className="bg-muted px-2 py-1 rounded">verifyHash</code>{' '}
              prop of the PasswordProtect component
            </li>
            <li>
              Provide a unique <code className="bg-muted px-2 py-1 rounded">localStorageKey</code>{' '}
              for password persistence
            </li>
          </ol>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📖 <strong>Documentation:</strong> Check out the full README at{' '}
              <code className="bg-blue-100 px-1 rounded">
                src/modules/password-protection/README.md
              </code>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Demo (password: "demo123"):</h2>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              💾 <strong>Persistence:</strong> Once you enter the correct password, it will be saved
              in localStorage. Refresh the page to see the auto-unlock feature in action!
            </p>
          </div>
          <PasswordProtect
            verifyHash="d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791"
            localStorageKey="password-protect-demo"
            title="Secret Content"
            description="This content is protected. Use password 'demo123' to unlock it."
          >
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Success!</h3>
              <p className="text-green-700 mb-4">
                You've successfully unlocked this protected content! This demonstrates how the
                password protection module works.
              </p>
              <div className="mt-4 p-4 bg-white rounded border">
                <h4 className="font-medium mb-2">Example use cases:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Confidential project details</li>
                  <li>• Internal documentation</li>
                  <li>• Sensitive configuration data</li>
                  <li>• Private notes or content</li>
                  <li>• Members-only sections</li>
                </ul>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is client-side protection only. For truly sensitive
                  data, use proper server-side authentication.
                </p>
              </div>
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded">
                <p className="text-sm text-purple-800">
                  <strong>localStorage:</strong> Your password is now stored with key
                  "password-protect-demo". Clear it from localStorage or use incognito mode to test
                  the password prompt again.
                </p>
              </div>
            </div>
          </PasswordProtect>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Import Example:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`import { PasswordProtect } from '@/modules/password-protection';

export default function MyPage() {
  return (
    <PasswordProtect 
      verifyHash="your-hash-here"
      localStorageKey="my-unique-storage-key"
    >
      <YourProtectedContent />
    </PasswordProtect>
  );
}`}
          </pre>
        </section>
      </div>
    </div>
  );
}
