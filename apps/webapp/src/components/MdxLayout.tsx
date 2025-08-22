import type { ReactNode } from 'react';

/**
 * Props for the MDX layout component.
 */
export interface MdxLayoutProps {
  children: ReactNode;
}

/**
 * Provides consistent layout styling for MDX documentation pages.
 */
export default function MdxLayout({ children }: MdxLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <article className="prose prose-lg dark:prose-invert max-w-none">{children}</article>
    </div>
  );
}
