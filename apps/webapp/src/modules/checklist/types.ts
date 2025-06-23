import type { Id } from '@workspace/backend/convex/_generated/dataModel';

export interface ChecklistItem {
  _id: Id<'checklistItems'>;
  _creationTime: number;
  checklistKey: string;
  text: string;
  isCompleted: boolean;
  order: number;
  createdAt: number;
  completedAt?: number;
  createdBy?: string;
  completedBy?: string;
}

// Optimistic item for UI state before server creation
export interface OptimisticChecklistItem {
  _id: string; // Temporary ID for optimistic items
  _creationTime: number;
  checklistKey: string;
  text: string;
  isCompleted: boolean;
  order: number;
  createdAt: number;
  completedAt?: number;
  createdBy?: string;
  completedBy?: string;
  isOptimistic: true;
  isPending: boolean;
}

// Union type for both real and optimistic items
export type ChecklistItemWithOptimistic = ChecklistItem | OptimisticChecklistItem;

export interface ChecklistState {
  _id: Id<'checklistState'>;
  _creationTime: number;
  key: string;
  title: string;
  isActive: boolean;
  createdAt: number;
  concludedAt?: number;
  concludedBy?: string;
  exists?: boolean;
}

export interface ChecklistProps {
  title: string;
  checklistKey: string;
  description?: string;
  className?: string;
}

export interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: (itemId: Id<'checklistItems'>) => void;
  onDelete: (itemId: Id<'checklistItems'>) => void;
  isActive: boolean;
}

export interface ChecklistItemFormProps {
  onSubmit: (text: string) => Promise<boolean>;
  onCancel?: () => void;
}
