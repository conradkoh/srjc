import type { ReactNode } from 'react';

/**
 * Props for the MDX layout component.
 */
export interface MdxLayoutProps {
  children: ReactNode;
}

/**
 * Provides consistent GitHub-style layout for MDX documentation pages.
 * Uses semantic colors and spacing that work perfectly with our custom MDX components.
 */
export default function MdxLayout({ children }: MdxLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <article className="mdx-content space-y-0">{children}</article>
    </div>
  );
}
