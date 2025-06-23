'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import type { Id } from '@workspace/backend/convex/_generated/dataModel';
import { CheckCheck, Loader2, MoreVertical, RotateCcw, Trash2 } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { ChecklistInlineInput } from './checklist-inline-input';
import type { ChecklistItemWithOptimistic, ChecklistProps } from './types';
import { useChecklistSync } from './use-checklist-sync';

export function Checklist({ title, checklistKey, description, className }: ChecklistProps) {
  const {
    items,
    isActive,
    isConcluded,
    totalItems,
    completedItems,
    completionPercentage,
    isLoading,
    initializeChecklist,
    addItem,
    getAndClearFailedText,
    toggleItem,
    deleteItem,
    concludeChecklist,
    reopenChecklist,
    clearCompleted,
  } = useChecklistSync({
    key: checklistKey,
    title,
  });

  // Initialize checklist on mount
  useEffect(() => {
    initializeChecklist();
  }, [initializeChecklist]);

  const handleAddItem = useCallback(
    async (text: string) => {
      return await addItem(text);
    },
    [addItem]
  );

  const handleToggleItem = useCallback(
    (itemId: string | Id<'checklistItems'>) => {
      // Only allow toggling real items, not optimistic ones
      if (typeof itemId === 'string' && itemId.startsWith('optimistic-')) {
        return;
      }
      toggleItem(itemId as Id<'checklistItems'>);
    },
    [toggleItem]
  );

  const handleDeleteItem = useCallback(
    (itemId: string | Id<'checklistItems'>) => {
      // Only allow deleting real items, not optimistic ones
      if (typeof itemId === 'string' && itemId.startsWith('optimistic-')) {
        return;
      }
      deleteItem(itemId as Id<'checklistItems'>);
    },
    [deleteItem]
  );

  const handleConcludeChecklist = useCallback(() => {
    concludeChecklist();
  }, [concludeChecklist]);

  const handleReopenChecklist = useCallback(() => {
    reopenChecklist();
  }, [reopenChecklist]);

  const handleClearCompleted = useCallback(() => {
    clearCompleted();
  }, [clearCompleted]);

  if (isLoading) {
    return (
      <Card className={`${className} flex flex-col gap-3`}>
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} flex flex-col gap-3`}>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isActive && (
                <>
                  {completedItems > 0 && (
                    <DropdownMenuItem onClick={handleClearCompleted}>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Clear Completed
                    </DropdownMenuItem>
                  )}
                  {completedItems > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={handleConcludeChecklist}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Conclude Checklist
                  </DropdownMenuItem>
                </>
              )}
              {isConcluded && (
                <DropdownMenuItem onClick={handleReopenChecklist}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reopen Checklist
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {totalItems > 0 && (
          <div className="space-y-2 mt-3">
            <Progress value={completionPercentage} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {completedItems} of {totalItems} completed ({Math.round(completionPercentage)}%)
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[250px] overflow-y-auto px-1 pb-1">
          {items.length === 0 && !isActive ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-muted-foreground italic">
                This checklist has been concluded.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <ChecklistItemComponent
                  key={item._id}
                  item={item}
                  onToggle={handleToggleItem}
                  onDelete={handleDeleteItem}
                  isActive={isActive}
                />
              ))}
              {isActive && (
                <ChecklistInlineInput
                  onSubmit={handleAddItem}
                  getAndClearFailedText={getAndClearFailedText}
                  placeholder="Add new item..."
                  className="mt-3 px-1"
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistItemComponent({
  item,
  onToggle,
  onDelete,
  isActive,
}: {
  item: ChecklistItemWithOptimistic;
  onToggle: (itemId: string | Id<'checklistItems'>) => void;
  onDelete: (itemId: string | Id<'checklistItems'>) => void;
  isActive: boolean;
}) {
  const isOptimistic = 'isOptimistic' in item && item.isOptimistic;
  const isPending = 'isPending' in item && item.isPending;

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg border bg-card transition-colors group ${
        isPending ? 'bg-muted/50 opacity-75' : 'hover:bg-accent/50'
      }`}
    >
      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={() => onToggle(item._id)}
        disabled={!isActive || isOptimistic}
      />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className={`text-sm ${item.isCompleted ? 'line-through text-muted-foreground' : ''} ${
            isPending ? 'text-muted-foreground' : ''
          }`}
        >
          {item.text}
        </span>
        {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>
      {isActive && !isOptimistic && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item._id)}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
