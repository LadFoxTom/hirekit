import { db } from '@repo/database-hirekit';

export interface CompanyContext {
  companyId: string;
  companyName: string;
  role: string;
}

type Role = 'owner' | 'admin' | 'hiring_manager' | 'member' | 'viewer';

const ROLE_LEVELS: Record<string, number> = {
  owner: 4,
  admin: 3,
  hiring_manager: 2,
  member: 1,
  viewer: 0,
};

export async function getCompanyForUser(userId: string): Promise<CompanyContext | null> {
  // Check CompanyUser table first
  const companyUser = await db.companyUser.findFirst({
    where: { userId },
    include: { company: { select: { id: true, name: true } } },
  });

  if (companyUser) {
    return {
      companyId: companyUser.company.id,
      companyName: companyUser.company.name,
      role: companyUser.role,
    };
  }

  // Fallback to Company.ownerId (backwards compat)
  const company = await db.company.findFirst({
    where: { ownerId: userId },
    select: { id: true, name: true },
  });

  if (!company) return null;

  // Lazy migration: auto-create CompanyUser with owner role
  await db.companyUser.create({
    data: {
      companyId: company.id,
      userId,
      role: 'owner',
    },
  }).catch(() => {
    // Ignore unique constraint violation (already exists)
  });

  return {
    companyId: company.id,
    companyName: company.name,
    role: 'owner',
  };
}

export function hasPermission(userRole: string, requiredRole: Role): boolean {
  return (ROLE_LEVELS[userRole] ?? 0) >= (ROLE_LEVELS[requiredRole] ?? 0);
}

export function requireRole(userRole: string, requiredRole: Role): void {
  if (!hasPermission(userRole, requiredRole)) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, got: ${userRole}`);
  }
}
