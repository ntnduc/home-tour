export enum Role {
  ADMIN = 'Admin',
  OWNER = 'Owner',
  PROPERTY_MANAGER = 'Property Manager',
  ACCOUNTANT = 'Accountant',
  TENANT = 'Tenant',
}

// Re-export Permission from permission-tree.type for backward compatibility
export { Permission } from '../types/permission-tree.type';
