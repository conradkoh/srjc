import { SessionIdArg } from 'convex-helpers/server/sessions';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get the current state of a checklist
export const getChecklistState = query({
  args: {
    key: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Look up the checklist state by key
    const state = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();

    if (!state) {
      // If no state exists for this key, return default values
      return {
        key: args.key,
        exists: false,
        isActive: false,
      };
    }

    return {
      ...state,
      exists: true,
    };
  },
});

// Get items for a checklist
export const getChecklistItems = query({
  args: {
    key: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Look up items for this checklist, ordered by order field
    const items = await ctx.db
      .query('checklistItems')
      .withIndex('by_checklist_order', (q) => q.eq('checklistKey', args.key))
      .order('asc')
      .collect();

    return items;
  },
});

// Create a new checklist
export const createChecklist = mutation({
  args: {
    key: v.string(),
    title: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Check if a checklist with this key already exists
    const existingChecklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();

    if (existingChecklist) {
      // If it exists, return the existing checklist ID
      return existingChecklist._id;
    }

    // Create a new checklist
    return await ctx.db.insert('checklistState', {
      key: args.key,
      title: args.title,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Add an item to a checklist
export const addChecklistItem = mutation({
  args: {
    checklistKey: v.string(),
    text: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Check if the checklist exists and is active
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.checklistKey))
      .first();

    if (!checklist) {
      throw new Error('Checklist not found');
    }

    if (!checklist.isActive) {
      throw new Error('Checklist is no longer active');
    }

    // Get the current max order to append the new item at the end
    const existingItems = await ctx.db
      .query('checklistItems')
      .withIndex('by_checklist', (q) => q.eq('checklistKey', args.checklistKey))
      .collect();

    const maxOrder =
      existingItems.length > 0 ? Math.max(...existingItems.map((item) => item.order)) : -1;

    // Add the item
    return await ctx.db.insert('checklistItems', {
      checklistKey: args.checklistKey,
      text: args.text,
      isCompleted: false,
      order: maxOrder + 1,
      createdAt: Date.now(),
      createdBy: args.sessionId,
    });
  },
});

// Toggle completion status of a checklist item
export const toggleChecklistItem = mutation({
  args: {
    itemId: v.id('checklistItems'),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Get the item
    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error('Checklist item not found');
    }

    // Check if the checklist is still active
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', item.checklistKey))
      .first();

    if (!checklist || !checklist.isActive) {
      throw new Error('Checklist is no longer active');
    }

    // Toggle the completion status
    const newCompletedStatus = !item.isCompleted;
    const updateData: {
      isCompleted: boolean;
      completedAt?: number;
      completedBy?: string;
    } = {
      isCompleted: newCompletedStatus,
    };

    if (newCompletedStatus) {
      updateData.completedAt = Date.now();
      updateData.completedBy = args.sessionId;
    } else {
      updateData.completedAt = undefined;
      updateData.completedBy = undefined;
    }

    return await ctx.db.patch(args.itemId, updateData);
  },
});

// Delete a checklist item
export const deleteChecklistItem = mutation({
  args: {
    itemId: v.id('checklistItems'),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Get the item
    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error('Checklist item not found');
    }

    // Check if the checklist is still active
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', item.checklistKey))
      .first();

    if (!checklist || !checklist.isActive) {
      throw new Error('Checklist is no longer active');
    }

    // Delete the item
    await ctx.db.delete(args.itemId);
    return { success: true };
  },
});

// Conclude a checklist
export const concludeChecklist = mutation({
  args: {
    checklistKey: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Check if the checklist exists
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.checklistKey))
      .first();

    if (!checklist) {
      throw new Error('Checklist not found');
    }

    // Mark the checklist as inactive
    return await ctx.db.patch(checklist._id, {
      isActive: false,
      concludedAt: Date.now(),
      concludedBy: args.sessionId,
    });
  },
});

// Reopen a concluded checklist
export const reopenChecklist = mutation({
  args: {
    checklistKey: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Check if the checklist exists
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.checklistKey))
      .first();

    if (!checklist) {
      throw new Error('Checklist not found');
    }

    // Mark the checklist as active and clear conclusion data
    return await ctx.db.patch(checklist._id, {
      isActive: true,
      concludedAt: undefined,
      concludedBy: undefined,
    });
  },
});

// Clear completed items from a checklist
export const clearCompletedItems = mutation({
  args: {
    checklistKey: v.string(),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Check if the checklist exists and is active
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.checklistKey))
      .first();

    if (!checklist) {
      throw new Error('Checklist not found');
    }

    if (!checklist.isActive) {
      throw new Error('Checklist is no longer active');
    }

    // Get all completed items
    const completedItems = await ctx.db
      .query('checklistItems')
      .withIndex('by_checklist', (q) => q.eq('checklistKey', args.checklistKey))
      .filter((q) => q.eq(q.field('isCompleted'), true))
      .collect();

    // Delete all completed items
    await Promise.all(completedItems.map((item) => ctx.db.delete(item._id)));

    return { deletedCount: completedItems.length };
  },
});

// Reorder checklist items
export const reorderChecklistItems = mutation({
  args: {
    checklistKey: v.string(),
    itemOrders: v.array(
      v.object({
        itemId: v.id('checklistItems'),
        newOrder: v.number(),
      })
    ),
    ...SessionIdArg,
  },
  handler: async (ctx, args) => {
    // Check if the checklist exists and is active
    const checklist = await ctx.db
      .query('checklistState')
      .withIndex('by_key', (q) => q.eq('key', args.checklistKey))
      .first();

    if (!checklist) {
      throw new Error('Checklist not found');
    }

    if (!checklist.isActive) {
      throw new Error('Checklist is no longer active');
    }

    // Update the order for each item
    await Promise.all(
      args.itemOrders.map(({ itemId, newOrder }) => ctx.db.patch(itemId, { order: newOrder }))
    );

    return { success: true };
  },
});
