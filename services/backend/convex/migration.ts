import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalAction, internalMutation, internalQuery } from './_generated/server';

const BATCH_SIZE = 100; // Process 100 sessions per batch

interface PaginationOpts {
  numItems: number;
  cursor: string | null;
}

/**
 * Internal mutation to remove deprecated expiration fields from a single session.
 * Part of the session expiration deprecation migration.
 */
export const unsetSessionExpiration = internalMutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      expiresAt: undefined,
      expiresAtLabel: undefined,
    });
  },
});

/**
 * Internal action to migrate all sessions by removing deprecated expiration fields.
 * Processes sessions in batches to avoid timeout issues.
 */
export const migrateUnsetSessionExpiration = internalAction({
  args: { cursor: v.optional(v.string()) }, // Convex cursor for pagination
  handler: async (ctx, args) => {
    const paginationOpts: PaginationOpts = {
      numItems: BATCH_SIZE,
      cursor: args.cursor ?? null,
    };

    // Fetch a batch of sessions
    const results = await ctx.runQuery(internal.migration.getSessionsBatch, {
      paginationOpts,
    });

    // Schedule mutations to update each session in the batch
    for (const session of results.page) {
      await ctx.runMutation(internal.migration.unsetSessionExpiration, {
        sessionId: session._id,
      });
    }

    // If there are more sessions, schedule the next batch
    if (!results.isDone) {
      await ctx.runAction(internal.migration.migrateUnsetSessionExpiration, {
        cursor: results.continueCursor,
      });
    }
  },
});

/**
 * Helper query to fetch sessions in batches for pagination during migration.
 */
export const getSessionsBatch = internalQuery({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query('sessions').paginate(args.paginationOpts);
  },
});

// ========================================
// USER ACCESS LEVEL MIGRATION
// ========================================

/**
 * Internal mutation to set default accessLevel for a user if currently undefined.
 * Part of the user access level migration to ensure all users have explicit access levels.
 */
export const setUserAccessLevelDefault = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return; // User doesn't exist, skip
    }

    // Only update if accessLevel is undefined
    if (user.accessLevel === undefined) {
      await ctx.db.patch(args.userId, {
        accessLevel: 'user',
      });
    }
  },
});

/**
 * Internal mutation to set all users with undefined accessLevel to 'user' in a single batch.
 * WARNING: This processes all users at once and may timeout for large user bases.
 * For large datasets, use migrateUserAccessLevels (action) instead.
 *
 * @returns Object with count of users updated
 */
export const setAllUndefinedAccessLevelsToUser = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Fetch all users with undefined accessLevel
    const allUsers = await ctx.db.query('users').collect();

    let updatedCount = 0;

    // Update each user that has undefined accessLevel
    for (const user of allUsers) {
      if (user.accessLevel === undefined) {
        await ctx.db.patch(user._id, {
          accessLevel: 'user',
        });
        updatedCount++;
      }
    }

    console.log(`Migration complete: Updated ${updatedCount} users to accessLevel: 'user'`);

    return {
      success: true,
      updatedCount,
      totalUsers: allUsers.length,
    };
  },
});

/**
 * Internal action to migrate all users to have explicit accessLevel values.
 * Sets undefined accessLevel fields to 'user' as the default.
 * Processes users in batches to handle large datasets safely.
 */
export const migrateUserAccessLevels = internalAction({
  args: { cursor: v.optional(v.string()) }, // Convex cursor for pagination
  handler: async (ctx, args) => {
    const paginationOpts: PaginationOpts = {
      numItems: BATCH_SIZE,
      cursor: args.cursor ?? null,
    };

    // Fetch a batch of users
    const results = await ctx.runQuery(internal.migration.getUsersBatch, {
      paginationOpts,
    });

    let updatedCount = 0;

    // Schedule mutations to update each user in the batch if needed
    for (const user of results.page) {
      if (user.accessLevel === undefined) {
        await ctx.runMutation(internal.migration.setUserAccessLevelDefault, {
          userId: user._id,
        });
        updatedCount++;
      }
    }

    console.log(`Processed batch: ${results.page.length} users, updated: ${updatedCount}`);

    // If there are more users, schedule the next batch
    if (!results.isDone) {
      await ctx.runAction(internal.migration.migrateUserAccessLevels, {
        cursor: results.continueCursor,
      });
    } else {
      console.log('User access level migration completed');
    }
  },
});

/**
 * Helper query to fetch users in batches for pagination during migration.
 */
export const getUsersBatch = internalQuery({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query('users').paginate(args.paginationOpts);
  },
});
