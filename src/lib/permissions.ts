import type { UsersRoleOptions } from '@/pocketbase/types';

/**
 * Determines if the user can perform create, update, or delete actions
 * based on their role and the collection being accessed.
 *
 * Permissions are derived from PocketBase schema rules:
 * https://ocampoapartments.pockethost.io/admin/collections
 *
 * - Administrator: Can create, update, delete most collections
 * - Building Admin: Can create, update, delete apartment_units, maintenance_workers, announcements, maintenance_requests
 * - Tenant: Can create payments, maintenance_requests, maintenance_workers; view specific records
 * - Applicant: Minimal permissions
 */

export interface PermissionFlags {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

/**
 * Define permissions by role and collection based on PocketBase schema rules
 * Null or empty string in rule means allowed for authenticated users
 */
const PERMISSIONS_MAP: Record<
  UsersRoleOptions,
  Record<string, PermissionFlags>
> = {
  Administrator: {
    // Admin has full access to all collections
    _mfas: { canCreate: false, canUpdate: false, canDelete: false },
    _otps: { canCreate: false, canUpdate: false, canDelete: false },
    _externalAuths: { canCreate: false, canUpdate: false, canDelete: true },
    _authOrigins: { canCreate: false, canUpdate: false, canDelete: true },
    _superusers: { canCreate: false, canUpdate: false, canDelete: false },
    users: { canCreate: false, canUpdate: true, canDelete: false },
    tenants: { canCreate: true, canUpdate: true, canDelete: true },
    properties: { canCreate: true, canUpdate: true, canDelete: true },
    apartment_units: { canCreate: true, canUpdate: true, canDelete: true },
    tenancies: { canCreate: true, canUpdate: true, canDelete: true },
    bills: { canCreate: true, canUpdate: true, canDelete: true },
    bill_items: { canCreate: true, canUpdate: true, canDelete: true },
    payments: { canCreate: true, canUpdate: true, canDelete: false },
    maintenance_workers: { canCreate: true, canUpdate: true, canDelete: true },
    maintenance_requests: {
      canCreate: true,
      canUpdate: true,
      canDelete: false,
    },
    announcements: { canCreate: true, canUpdate: true, canDelete: true },
    inquiries: { canCreate: false, canUpdate: false, canDelete: false },
    otp: { canCreate: false, canUpdate: false, canDelete: false },
    forms: { canCreate: false, canUpdate: false, canDelete: false },
    emails: { canCreate: false, canUpdate: false, canDelete: false },
    schedules: { canCreate: false, canUpdate: true, canDelete: true },
  },
  'Building Admin': {
    _mfas: { canCreate: false, canUpdate: false, canDelete: false },
    _otps: { canCreate: false, canUpdate: false, canDelete: false },
    _externalAuths: { canCreate: false, canUpdate: false, canDelete: false },
    _authOrigins: { canCreate: false, canUpdate: false, canDelete: false },
    _superusers: { canCreate: false, canUpdate: false, canDelete: false },
    users: { canCreate: false, canUpdate: false, canDelete: false },
    tenants: { canCreate: false, canUpdate: false, canDelete: false },
    properties: { canCreate: false, canUpdate: false, canDelete: false },
    apartment_units: { canCreate: true, canUpdate: true, canDelete: true },
    tenancies: { canCreate: false, canUpdate: false, canDelete: false },
    bills: { canCreate: false, canUpdate: false, canDelete: false },
    bill_items: { canCreate: false, canUpdate: false, canDelete: false },
    payments: { canCreate: false, canUpdate: false, canDelete: false },
    maintenance_workers: { canCreate: true, canUpdate: true, canDelete: true },
    maintenance_requests: {
      canCreate: false,
      canUpdate: true,
      canDelete: false,
    },
    announcements: { canCreate: true, canUpdate: true, canDelete: true },
    inquiries: { canCreate: false, canUpdate: false, canDelete: false },
    otp: { canCreate: false, canUpdate: false, canDelete: false },
    forms: { canCreate: false, canUpdate: false, canDelete: false },
    emails: { canCreate: false, canUpdate: false, canDelete: false },
    schedules: { canCreate: false, canUpdate: false, canDelete: false },
  },
  Tenant: {
    _mfas: { canCreate: false, canUpdate: false, canDelete: false },
    _otps: { canCreate: false, canUpdate: false, canDelete: false },
    _externalAuths: { canCreate: false, canUpdate: false, canDelete: false },
    _authOrigins: { canCreate: false, canUpdate: false, canDelete: false },
    _superusers: { canCreate: false, canUpdate: false, canDelete: false },
    users: { canCreate: false, canUpdate: false, canDelete: false },
    tenants: { canCreate: false, canUpdate: false, canDelete: false },
    properties: { canCreate: false, canUpdate: false, canDelete: false },
    apartment_units: { canCreate: false, canUpdate: false, canDelete: false },
    tenancies: { canCreate: false, canUpdate: false, canDelete: false },
    bills: { canCreate: false, canUpdate: false, canDelete: false },
    bill_items: { canCreate: false, canUpdate: false, canDelete: false },
    payments: { canCreate: true, canUpdate: false, canDelete: false },
    maintenance_workers: {
      canCreate: true,
      canUpdate: false,
      canDelete: false,
    },
    maintenance_requests: {
      canCreate: true,
      canUpdate: false,
      canDelete: false,
    },
    announcements: { canCreate: false, canUpdate: false, canDelete: false },
    inquiries: { canCreate: false, canUpdate: false, canDelete: false },
    otp: { canCreate: false, canUpdate: false, canDelete: false },
    forms: { canCreate: false, canUpdate: false, canDelete: false },
    emails: { canCreate: false, canUpdate: false, canDelete: false },
    schedules: { canCreate: true, canUpdate: false, canDelete: false },
  },
  Applicant: {
    _mfas: { canCreate: false, canUpdate: false, canDelete: false },
    _otps: { canCreate: false, canUpdate: false, canDelete: false },
    _externalAuths: { canCreate: false, canUpdate: false, canDelete: false },
    _authOrigins: { canCreate: false, canUpdate: false, canDelete: false },
    _superusers: { canCreate: false, canUpdate: false, canDelete: false },
    users: { canCreate: false, canUpdate: false, canDelete: false },
    tenants: { canCreate: false, canUpdate: false, canDelete: false },
    properties: { canCreate: false, canUpdate: false, canDelete: false },
    apartment_units: { canCreate: false, canUpdate: false, canDelete: false },
    tenancies: { canCreate: false, canUpdate: false, canDelete: false },
    bills: { canCreate: false, canUpdate: false, canDelete: false },
    bill_items: { canCreate: false, canUpdate: false, canDelete: false },
    payments: { canCreate: false, canUpdate: false, canDelete: false },
    maintenance_workers: {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    },
    maintenance_requests: {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    },
    announcements: { canCreate: false, canUpdate: false, canDelete: false },
    inquiries: { canCreate: false, canUpdate: false, canDelete: false },
    otp: { canCreate: false, canUpdate: false, canDelete: false },
    forms: { canCreate: false, canUpdate: false, canDelete: false },
    emails: { canCreate: false, canUpdate: false, canDelete: false },
    schedules: { canCreate: false, canUpdate: false, canDelete: false },
  },
};

/**
 * Get permission flags based on user role and collection name
 * @param role - The user's role (Administrator, Building Admin, Tenant, Applicant, or Automation)
 * @param collection - The collection name being accessed
 * @returns Object with canCreate, canUpdate, and canDelete flags
 */
export function getPermissions(
  role: UsersRoleOptions | undefined,
  collection: string,
): PermissionFlags {
  // If no role provided, deny all permissions
  if (!role) {
    return {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };
  }

  // Get permissions from map, fallback to no permissions if collection not found
  return (
    PERMISSIONS_MAP[role]?.[collection] ?? {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    }
  );
}
