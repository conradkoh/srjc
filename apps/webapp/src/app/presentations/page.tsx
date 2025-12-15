import type { Metadata } from 'next';
import { PresentationsGrid } from '@/components/presentations-grid';

export const metadata: Metadata = {
  title: 'Sharings | SRJC',
  description: 'Browse sharing materials for SRJC cell group members',
};

export default function PresentationsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Our Sharings 💭</h1>
      <p className="text-muted-foreground mb-8">Catch up on anything you missed!</p>
      <PresentationsGrid />
    </div>
  );
}
