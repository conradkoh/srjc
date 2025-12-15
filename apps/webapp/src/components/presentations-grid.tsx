import { PresentationCard, type PresentationInfo } from '@/components/presentation-card';

const PRESENTATIONS: PresentationInfo[] = [
  {
    id: 'grow-love-for-god',
    title: 'Grow in Love for God',
    date: 'August 23, 2025',
    description: 'Cell sharing: How can we grow in our love for God?',
    path: '/presentations/20250823-grow-love-for-god',
  },
  {
    id: 'luke-10',
    title: 'Making a Difference',
    date: 'May 16, 2025',
    description: 'Cell Group sharing on Luke 10: The Good Samaritan and Martha & Mary',
    path: '/presentations/20250516-luke-10',
  },
  {
    id: 'confession',
    title: 'Confession',
    date: 'April 25, 2025',
    description: 'Cell Group sharing on Confession',
    path: '/presentations/20250425-confession',
  },
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
