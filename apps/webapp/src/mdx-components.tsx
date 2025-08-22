import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

/**
 * Props for heading components.
 */
interface HeadingProps {
  children: ReactNode;
}

/**
 * Props for paragraph and list components.
 */
interface ContentProps {
  children: ReactNode;
}

/**
 * Props for anchor components.
 */
interface AnchorProps {
  href?: string;
  children: ReactNode;
}

/**
 * Provides customized styling for all MDX components with semantic colors and dark mode support.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }: HeadingProps) => (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }: HeadingProps) => (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }: HeadingProps) => (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }: ContentProps) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground">{children}</p>
    ),
    ul: ({ children }: ContentProps) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground">{children}</ul>
    ),
    ol: ({ children }: ContentProps) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground">{children}</ol>
    ),
    li: ({ children }: ContentProps) => <li className="text-foreground">{children}</li>,
    blockquote: ({ children }: ContentProps) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic border-border text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({ children }: ContentProps) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
        {children}
      </code>
    ),
    pre: ({ children }: ContentProps) => (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4">
        <code className="relative rounded bg-transparent px-0 py-0 font-mono text-sm text-foreground">
          {children}
        </code>
      </pre>
    ),
    a: ({ href, children }: AnchorProps) => (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:bg-accent/50 rounded px-1 py-0.5"
      >
        {children}
      </a>
    ),
    ...components,
  };
}
