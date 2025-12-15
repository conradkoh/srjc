import type { Metadata } from 'next';
import Content from './content.mdx';

export const metadata: Metadata = {
  title: 'Grow in Love for God | Aug 22, 2025',
  description: 'Cell sharing: How can we grow in our love for God?',
};

export default function GrowLoveForGodPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <article className="max-w-none">
        <Content />
      </article>
    </div>
  );
}
