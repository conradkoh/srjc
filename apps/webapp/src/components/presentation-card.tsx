import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface PresentationInfo {
  id: string;
  title: string;
  date: string;
  description?: string;
  path: string;
}

export function PresentationCard({ presentation }: { presentation: PresentationInfo }) {
  return (
    <div className="p-6 border rounded-lg bg-card hover:bg-muted/30 transition-colors relative">
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-muted/30 rounded-bl-lg" />

      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>{presentation.date}</span>
      </div>

      <h3 className="text-2xl font-medium mb-3">{presentation.title}</h3>

      {presentation.description && (
        <p className="text-muted-foreground mb-4">{presentation.description}</p>
      )}

      <div className="mt-4 w-full flex justify-end">
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href={presentation.path}>view slides →</Link>
        </Button>
      </div>
    </div>
  );
}
