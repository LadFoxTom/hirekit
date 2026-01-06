// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export class AuditService {
  /**
   * Log an audit event
   */
  static async logAudit(
    entityType: string,
    entityId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW',
    context: AuditContext,
    oldValues?: any,
    newValues?: any,
    changes?: AuditChange[]
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          entityType,
          entityId,
          action,
          userId: context.userId,
          oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
          newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
          changes: changes ? JSON.parse(JSON.stringify(changes)) : null,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          sessionId: context.sessionId,
        },
      });
    } catch (error) {
      console.error('Failed to log audit:', error);
      // Don't throw - audit logging should not break main functionality
    }
  }

  /**
   * Log document changes for versioning
   */
  static async logChange(
    documentType: 'CV' | 'Letter',
    documentId: string,
    version: number,
    userId: string,
    changes: AuditChange[],
    summary: string
  ) {
    try {
      await prisma.changeLog.create({
        data: {
          documentType,
          documentId,
          version,
          userId,
          changes: JSON.parse(JSON.stringify(changes)),
          summary,
        },
      });
    } catch (error) {
      console.error('Failed to log change:', error);
    }
  }

  /**
   * Get audit trail for an entity
   */
  static async getAuditTrail(entityType: string, entityId: string) {
    return await prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get change history for a document
   */
  static async getChangeHistory(documentType: string, documentId: string) {
    return await prisma.changeLog.findMany({
      where: {
        documentType,
        documentId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        version: 'desc',
      },
    });
  }

  /**
   * Compare two objects and return changes
   */
  static getChanges(oldObj: any, newObj: any): AuditChange[] {
    const changes: AuditChange[] = [];
    const allKeys = Array.from(new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]));

    for (const key of allKeys) {
      const oldValue = oldObj?.[key];
      const newValue = newObj?.[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key,
          oldValue,
          newValue,
        });
      }
    }

    return changes;
  }

  /**
   * Generate human-readable summary of changes
   */
  static generateSummary(changes: AuditChange[]): string {
    if (changes.length === 0) return 'No changes detected';

    const summaries = changes.map(change => {
      if (change.oldValue === undefined) {
        return `Added ${change.field}`;
      } else if (change.newValue === undefined) {
        return `Removed ${change.field}`;
      } else {
        return `Updated ${change.field}`;
      }
    });

    return summaries.join(', ');
  }
}

// Middleware for automatic audit logging
export const withAudit = <T extends any[], R>(
  entityType: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW',
  fn: (...args: T) => Promise<R>,
  getEntityId: (...args: T) => string,
  getContext: (...args: T) => AuditContext
) => {
  return async (...args: T): Promise<R> => {
    const entityId = getEntityId(...args);
    const context = getContext(...args);

    try {
      const result = await fn(...args);
      
      // Log the action
      await AuditService.logAudit(entityType, entityId, action, context);
      
      return result;
    } catch (error) {
      // Log failed actions too
      await AuditService.logAudit(entityType, entityId, action, context);
      throw error;
    }
  };
}; 