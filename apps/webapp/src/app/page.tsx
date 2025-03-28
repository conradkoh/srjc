'use client';
import { PresentationsGrid } from '@/components/presentations-grid';
import { api } from '@workspace/backend/convex/_generated/api';
import { useQuery } from 'convex/react';

export default function Home() {
  const appInfo = useQuery(api.appinfo.get);
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to SRJC! 🙏</h1>
        <p className="text-xl text-muted-foreground">
          Here you'll find our latest cell group sharings and resources. ✨
        </p>
      </section>

      <section>
        <PresentationsGrid />
      </section>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        App Version: {appInfo?.version}
      </div>
    </div>
  );
}
