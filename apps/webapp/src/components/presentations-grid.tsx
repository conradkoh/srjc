import { PresentationCard, type PresentationInfo } from '@/components/presentation-card';

const PRESENTATIONS: PresentationInfo[] = [
  {
    id: 'spiritual-appetites',
    title: 'Spiritual Appetites',
    date: 'March 28, 2025',
    description: 'Cell Group sharing on Spiritual Appetites',
    path: '/presentations/20250328-spiritual-appetites',
  },
  // Add more presentations here as they become available
];

export function PresentationsGrid() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Recent Sharings</h2>
      <div className="flex flex-col gap-6">
        {PRESENTATIONS.map((presentation) => (
          <PresentationCard key={presentation.id} presentation={presentation} />
        ))}
      </div>
    </div>
  );
}
