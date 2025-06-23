interface ChecklistEmptyStateProps {
  isActive: boolean;
  onAddItem: () => void;
}

export function ChecklistEmptyState({ isActive }: ChecklistEmptyStateProps) {
  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-muted-foreground italic">
          This checklist has been concluded.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-sm text-muted-foreground italic">
        No items yet. Start typing below to add your first item!
      </div>
    </div>
  );
}
