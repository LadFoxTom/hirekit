// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface OrganizationSettings {
  allowPublicCVs: boolean;
  requireApproval: boolean;
  defaultTemplate: string;
  branding: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
  features: {
    aiEnabled: boolean;
    analyticsEnabled: boolean;
    apiAccess: boolean;
  };
}

export interface UserPermissions {
  canCreateCV: boolean;
  canEditCV: boolean;
  canDeleteCV: boolean;
  canExportCV: boolean;
  canInviteUsers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canUseAI: boolean;
}

export class OrganizationService {
  // Default permissions for each role
  private static readonly ROLE_PERMISSIONS: Record<string, UserPermissions> = {
    owner: {
      canCreateCV: true,
      canEditCV: true,
      canDeleteCV: true,
      canExportCV: true,
      canInviteUsers: true,
      canManageSettings: true,
      canViewAnalytics: true,
      canUseAI: true,
    },
    admin: {
      canCreateCV: true,
      canEditCV: true,
      canDeleteCV: true,
      canExportCV: true,
      canInviteUsers: true,
      canManageSettings: false,
      canViewAnalytics: true,
      canUseAI: true,
    },
    member: {
      canCreateCV: true,
      canEditCV: true,
      canDeleteCV: false,
      canExportCV: true,
      canInviteUsers: false,
      canManageSettings: false,
      canViewAnalytics: false,
      canUseAI: true,
    },
    viewer: {
      canCreateCV: false,
      canEditCV: false,
      canDeleteCV: false,
      canExportCV: false,
      canInviteUsers: false,
      canManageSettings: false,
      canViewAnalytics: false,
      canUseAI: false,
    },
  };

  /**
   * Create a new organization
   */
  static async createOrganization(
    name: string,
    slug: string,
    ownerId: string,
    description?: string
  ) {
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        settings: this.getDefaultSettings() as any,
        users: {
          create: {
            userId: ownerId,
            role: 'owner',
            permissions: this.ROLE_PERMISSIONS.owner as any,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return organization;
  }

  /**
   * Get organization by slug
   */
  static async getOrganizationBySlug(slug: string) {
    return await prisma.organization.findUnique({
      where: { slug },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get user's organizations
   */
  static async getUserOrganizations(userId: string) {
    return await prisma.organizationUser.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            users: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Add user to organization
   */
  static async addUserToOrganization(
    organizationId: string,
    userId: string,
    role: string = 'member',
    permissions?: UserPermissions
  ) {
    const defaultPermissions = this.ROLE_PERMISSIONS[role] || this.ROLE_PERMISSIONS.member;

    return await prisma.organizationUser.create({
      data: {
        organizationId,
        userId,
        role,
        permissions: (permissions || defaultPermissions) as any,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        organization: true,
      },
    });
  }

  /**
   * Remove user from organization
   */
  static async removeUserFromOrganization(organizationId: string, userId: string) {
    return await prisma.organizationUser.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  }

  /**
   * Update user role in organization
   */
  static async updateUserRole(
    organizationId: string,
    userId: string,
    role: string,
    permissions?: UserPermissions
  ) {
    const defaultPermissions = this.ROLE_PERMISSIONS[role] || this.ROLE_PERMISSIONS.member;

    return await prisma.organizationUser.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      data: {
        role,
        permissions: (permissions || defaultPermissions) as any,
      },
    });
  }

  /**
   * Check if user has permission in organization
   */
  static async hasPermission(
    organizationId: string,
    userId: string,
    permission: keyof UserPermissions
  ): Promise<boolean> {
    const orgUser = await prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    if (!orgUser) return false;

    const permissions = orgUser.permissions as any as UserPermissions;
    return permissions?.[permission] || false;
  }

  /**
   * Get user's role in organization
   */
  static async getUserRole(organizationId: string, userId: string): Promise<string | null> {
    const orgUser = await prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    return orgUser?.role || null;
  }

  /**
   * Update organization settings
   */
  static async updateOrganizationSettings(
    organizationId: string,
    settings: Partial<OrganizationSettings>
  ) {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const currentSettings = organization.settings as any as OrganizationSettings;
    const updatedSettings = { ...currentSettings, ...settings };

    return await prisma.organization.update({
      where: { id: organizationId },
      data: {
        settings: updatedSettings,
      },
    });
  }

  /**
   * Get organization analytics
   */
  static async getOrganizationAnalytics(organizationId: string) {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    // Get CVs created by organization members
    const memberIds = organization.users.map(ou => ou.userId);
    const cvs = await prisma.cV.findMany({
      where: {
        userId: { in: memberIds },
      },
      select: {
        id: true,
        title: true,
        template: true,
        createdAt: true,
        viewCount: true,
        downloadCount: true,
      },
    });

    // Get letters created by organization members
    const letters = await prisma.letter.findMany({
      where: {
        userId: { in: memberIds },
      },
      select: {
        id: true,
        title: true,
        template: true,
        createdAt: true,
        viewCount: true,
        downloadCount: true,
      },
    });

    // Calculate analytics
    const analytics = {
      totalMembers: organization.users.length,
      totalCVs: cvs.length,
      totalLetters: letters.length,
      totalViews: cvs.reduce((sum, cv) => sum + cv.viewCount, 0) + 
                  letters.reduce((sum, letter) => sum + letter.viewCount, 0),
      totalDownloads: cvs.reduce((sum, cv) => sum + cv.downloadCount, 0) + 
                     letters.reduce((sum, letter) => sum + letter.downloadCount, 0),
      cvTemplates: cvs.reduce((acc, cv) => {
        acc[cv.template] = (acc[cv.template] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      letterTemplates: letters.reduce((acc, letter) => {
        acc[letter.template] = (acc[letter.template] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: [
        ...cvs.map(cv => ({ type: 'cv', ...cv })),
        ...letters.map(letter => ({ type: 'letter', ...letter })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10),
    };

    return analytics;
  }

  /**
   * Get default organization settings
   */
  private static getDefaultSettings(): OrganizationSettings {
    return {
      allowPublicCVs: false,
      requireApproval: false,
      defaultTemplate: 'modern',
      branding: {
        colors: {
          primary: '#3B82F6',
          secondary: '#1F2937',
        },
      },
      features: {
        aiEnabled: true,
        analyticsEnabled: true,
        apiAccess: false,
      },
    };
  }

  /**
   * Check if organization has reached user limit
   */
  static async canAddUser(organizationId: string): Promise<boolean> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: true,
      },
    });

    if (!organization) return false;

    return organization.users.length < organization.maxUsers;
  }

  /**
   * Get organization billing info
   */
  static async getOrganizationBilling(organizationId: string) {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        plan: true,
        stripeCustomerId: true,
        maxUsers: true,
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    return {
      plan: organization.plan,
      stripeCustomerId: organization.stripeCustomerId,
      maxUsers: organization.maxUsers,
      currentUsers: organization.users.length,
      canAddUsers: organization.users.length < organization.maxUsers,
    };
  }
} 