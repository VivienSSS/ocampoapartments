import type { UsersRoleOptions } from '@/pocketbase/types';

/**
 * Determines if the user can perform create, update, or delete actions
 * based on their role and the collection being accessed.
 *
 * Permissions:
 * - Administrator/Building Admin: Can create, update, delete all collections
 * - Tenant: Can only create/write on payments and maintenance_requests
 */

export interface PermissionFlags {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

/**
 * Collections where tenants have write permissions
 */
const TENANT_WRITE_COLLECTIONS = new Set(['payments', 'maintenance_requests']);

/**
 * Get permission flags based on user role and collection name
 * @param role - The user's role (Administrator, Building Admin, Tenant, or Applicant)
 * @param collection - The collection name being accessed
 * @returns Object with canCreate, canUpdate, and canDelete flags
 */
export function getPermissions(
  role: UsersRoleOptions | undefined,
  collection: string,
): PermissionFlags {
  // Admin roles have all permissions
  if (role === 'Administrator' || role === 'Building Admin') {
    return {
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    };
  }

  // Tenant permissions are limited to specific collections
  if (role === 'Tenant' && TENANT_WRITE_COLLECTIONS.has(collection)) {
    return {
      canCreate: true,
      canUpdate: false, // Tenants cannot update after submission
      canDelete: false, // Tenants cannot delete after submission
    };
  }

  // Default: no permissions (Applicant and other roles)
  return {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  };
}
