'use client';

import MdxLayout from '@/components/MdxLayout';
import SampleMDX from './sample.mdx';

/**
 * Test page for demonstrating MDX functionality and rendering capabilities.
 * Showcases various MDX features including component embedding, layout options,
 * and content styling with semantic colors for dark mode support.
 *
 * This page serves as:
 * - Development testing environment for MDX features
 * - Visual demonstration of markdown rendering
 * - Example implementation reference for developers
 * - UI/UX validation for typography and styling
 */
export default function MdxTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground">MDX Test Page</h1>

      <div className="space-y-8">
        {/* Real MDX File Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Real MDX File (sample.mdx)</h2>
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="mdx-content">
              <SampleMDX />
            </div>
          </div>
        </div>

        {/* MDX with Layout Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Same MDX with Layout</h2>
          <div className="border border-border rounded-lg bg-card">
            <MdxLayout>
              <SampleMDX />
            </MdxLayout>
          </div>
        </div>

        {/* Manual MDX Content for Comparison */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Manual JSX (for comparison)
          </h2>
          <div className="border border-border rounded-lg p-6 bg-card">
            <SampleMDXContent />
          </div>
        </div>

        {/* Side-by-side MDX Comparison */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Layout Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Direct MDX</h3>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="mdx-content">
                  <SampleMDX />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">With Layout Wrapper</h3>
              <div className="border border-border rounded-lg bg-card">
                <MdxLayout>
                  <SampleMDX />
                </MdxLayout>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode Testing */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Dark Mode Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium mb-2 text-foreground">Semantic Colors</h3>
              <SemanticColorsMDX />
            </div>
            <div className="border border-border rounded-lg p-4 bg-muted">
              <h3 className="text-lg font-medium mb-2 text-foreground">Muted Background</h3>
              <SemanticColorsMDX />
            </div>
            <div className="border border-border rounded-lg p-4 bg-accent">
              <h3 className="text-lg font-medium mb-2 text-foreground">Accent Background</h3>
              <SemanticColorsMDX />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sample MDX content for basic testing.
 */
function SampleMDXContent() {
  return (
    <div className="mdx-content">
      <h1>Basic MDX Content</h1>
      <p>
        This is <strong>basic MDX content</strong> with <em>formatting</em>.
      </p>
      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>List item three</li>
      </ul>
      <p>
        <a href="/">Link to home</a>
      </p>
      <blockquote>
        <p>This is a clean blockquote without italic styling, following GitHub's approach.</p>
      </blockquote>
      <p>
        Here's some <code>inline code</code> that looks clean and readable.
      </p>
    </div>
  );
}

/**
 * Advanced MDX content with code blocks and quotes.
 */
function _AdvancedMDXContent() {
  return (
    <>
      <h1>Advanced MDX Features</h1>
      <p>This demonstrates more complex MDX capabilities.</p>

      <h2>Code Example</h2>
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4">
        <code className="relative rounded bg-transparent px-0 py-0 font-mono text-sm text-foreground">
          {`// TypeScript example
interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "John Doe",
  email: "john@example.com"
};`}
        </code>
      </pre>

      <blockquote className="mt-6 border-l-2 pl-6 italic border-border text-muted-foreground">
        This is a blockquote demonstrating semantic color usage for dark mode compatibility.
      </blockquote>

      <h3>Nested Lists</h3>
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground">
        <li>First level item</li>
        <li>
          Second level:
          <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
            <li>Nested item A</li>
            <li>Nested item B</li>
          </ul>
        </li>
        <li>Back to first level</li>
      </ol>
    </>
  );
}

/**
 * Compact MDX content for comparison testing.
 */
function _CompactMDXContent() {
  return (
    <>
      <h3>Compact Content</h3>
      <p>Smaller content for layout comparison.</p>
      <ul>
        <li>Feature A</li>
        <li>Feature B</li>
      </ul>
      <p>
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
          inline code
        </code>
      </p>
    </>
  );
}

/**
 * MDX content specifically for testing semantic colors.
 */
function SemanticColorsMDX() {
  return (
    <div className="mdx-content">
      <p>Primary text with semantic colors</p>
      <p className="text-muted-foreground">Muted secondary text</p>
      <p>
        <a href="/">Clean primary link</a>
      </p>
      <p>
        <code>inline code</code> with proper contrast
      </p>
      <blockquote>
        <p>Clean blockquote styling</p>
      </blockquote>
    </div>
  );
}
