import { Permission, PermissionNode } from '../types/permission-tree.type';

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'SYSTEM',
    name: 'System Management',
    description: 'System-wide administrative permissions',
    children: [
      {
        id: Permission.MANAGE_SYSTEM,
        name: 'Manage System',
        description: 'Full system management access',
        parent: 'SYSTEM',
      },
      {
        id: Permission.VIEW_ALL_REPORTS,
        name: 'View All Reports',
        description: 'Access to all system reports',
        parent: 'SYSTEM',
      },
    ],
  },
  {
    id: 'PROPERTY',
    name: 'Property Management',
    description: 'Property-related permissions',
    children: [
      {
        id: Permission.MANAGE_PROPERTY,
        name: 'Manage Properties',
        description: 'Full property management access',
        parent: 'PROPERTY',
        children: [
          {
            id: Permission.CREATE_PROPERTY,
            name: 'Create Property',
            parent: Permission.MANAGE_PROPERTY,
          },
          {
            id: Permission.EDIT_PROPERTY,
            name: 'Edit Property',
            parent: Permission.MANAGE_PROPERTY,
          },
          {
            id: Permission.DELETE_PROPERTY,
            name: 'Delete Property',
            parent: Permission.MANAGE_PROPERTY,
          },
          {
            id: Permission.VIEW_PROPERTY,
            name: 'View Property',
            parent: Permission.MANAGE_PROPERTY,
          },
        ],
      },
    ],
  },
  {
    id: 'ROOM',
    name: 'Room Management',
    description: 'Room-related permissions',
    children: [
      {
        id: Permission.MANAGE_ROOM,
        name: 'Manage Rooms',
        description: 'Full room management access',
        parent: 'ROOM',
        children: [
          {
            id: Permission.CREATE_ROOM,
            name: 'Create Room',
            parent: Permission.MANAGE_ROOM,
          },
          {
            id: Permission.EDIT_ROOM,
            name: 'Edit Room',
            parent: Permission.MANAGE_ROOM,
          },
          {
            id: Permission.DELETE_ROOM,
            name: 'Delete Room',
            parent: Permission.MANAGE_ROOM,
          },
          {
            id: Permission.VIEW_ROOM,
            name: 'View Room',
            parent: Permission.MANAGE_ROOM,
          },
        ],
      },
    ],
  },
  {
    id: 'CONTRACT',
    name: 'Contract Management',
    description: 'Contract-related permissions',
    children: [
      {
        id: Permission.MANAGE_CONTRACT,
        name: 'Manage Contracts',
        description: 'Full contract management access',
        parent: 'CONTRACT',
        children: [
          {
            id: Permission.CREATE_CONTRACT,
            name: 'Create Contract',
            parent: Permission.MANAGE_CONTRACT,
          },
          {
            id: Permission.EDIT_CONTRACT,
            name: 'Edit Contract',
            parent: Permission.MANAGE_CONTRACT,
          },
          {
            id: Permission.DELETE_CONTRACT,
            name: 'Delete Contract',
            parent: Permission.MANAGE_CONTRACT,
          },
          {
            id: Permission.VIEW_CONTRACT,
            name: 'View Contract',
            parent: Permission.MANAGE_CONTRACT,
          },
          {
            id: Permission.TERMINATE_CONTRACT,
            name: 'Terminate Contract',
            parent: Permission.MANAGE_CONTRACT,
          },
        ],
      },
    ],
  },
  {
    id: 'SERVICE',
    name: 'Service Management',
    description: 'Service-related permissions',
    children: [
      {
        id: Permission.MANAGE_SERVICE,
        name: 'Manage Services',
        description: 'Full service management access',
        parent: 'SERVICE',
        children: [
          {
            id: Permission.CREATE_SERVICE,
            name: 'Create Service',
            parent: Permission.MANAGE_SERVICE,
          },
          {
            id: Permission.EDIT_SERVICE,
            name: 'Edit Service',
            parent: Permission.MANAGE_SERVICE,
          },
          {
            id: Permission.DELETE_SERVICE,
            name: 'Delete Service',
            parent: Permission.MANAGE_SERVICE,
          },
          {
            id: Permission.VIEW_SERVICE,
            name: 'View Service',
            parent: Permission.MANAGE_SERVICE,
          },
          {
            id: Permission.RECORD_UTILITY_READING,
            name: 'Record Utility Reading',
            parent: Permission.MANAGE_SERVICE,
          },
        ],
      },
    ],
  },
  {
    id: 'INVOICE',
    name: 'Invoice Management',
    description: 'Invoice-related permissions',
    children: [
      {
        id: Permission.MANAGE_INVOICE,
        name: 'Manage Invoices',
        description: 'Full invoice management access',
        parent: 'INVOICE',
        children: [
          {
            id: Permission.CREATE_INVOICE,
            name: 'Create Invoice',
            parent: Permission.MANAGE_INVOICE,
          },
          {
            id: Permission.EDIT_INVOICE,
            name: 'Edit Invoice',
            parent: Permission.MANAGE_INVOICE,
          },
          {
            id: Permission.DELETE_INVOICE,
            name: 'Delete Invoice',
            parent: Permission.MANAGE_INVOICE,
          },
          {
            id: Permission.VIEW_INVOICE,
            name: 'View Invoice',
            parent: Permission.MANAGE_INVOICE,
          },
          {
            id: Permission.RECORD_PAYMENT,
            name: 'Record Payment',
            parent: Permission.MANAGE_INVOICE,
          },
        ],
      },
    ],
  },
  {
    id: 'MAINTENANCE',
    name: 'Maintenance Management',
    description: 'Maintenance-related permissions',
    children: [
      {
        id: Permission.MANAGE_MAINTENANCE,
        name: 'Manage Maintenance',
        description: 'Full maintenance management access',
        parent: 'MAINTENANCE',
        children: [
          {
            id: Permission.CREATE_MAINTENANCE_REQUEST,
            name: 'Create Maintenance Request',
            parent: Permission.MANAGE_MAINTENANCE,
          },
          {
            id: Permission.EDIT_MAINTENANCE_REQUEST,
            name: 'Edit Maintenance Request',
            parent: Permission.MANAGE_MAINTENANCE,
          },
          {
            id: Permission.VIEW_MAINTENANCE_REQUEST,
            name: 'View Maintenance Request',
            parent: Permission.MANAGE_MAINTENANCE,
          },
          {
            id: Permission.ASSIGN_MAINTENANCE_REQUEST,
            name: 'Assign Maintenance Request',
            parent: Permission.MANAGE_MAINTENANCE,
          },
        ],
      },
    ],
  },
  {
    id: 'USER',
    name: 'User Management',
    description: 'User-related permissions',
    children: [
      {
        id: Permission.MANAGE_USER,
        name: 'Manage Users',
        description: 'Full user management access',
        parent: 'USER',
        children: [
          {
            id: Permission.CREATE_USER,
            name: 'Create User',
            parent: Permission.MANAGE_USER,
          },
          {
            id: Permission.EDIT_USER,
            name: 'Edit User',
            parent: Permission.MANAGE_USER,
          },
          {
            id: Permission.DELETE_USER,
            name: 'Delete User',
            parent: Permission.MANAGE_USER,
          },
          {
            id: Permission.VIEW_USER,
            name: 'View User',
            parent: Permission.MANAGE_USER,
          },
          {
            id: Permission.ASSIGN_ROLE,
            name: 'Assign Role',
            parent: Permission.MANAGE_USER,
          },
        ],
      },
    ],
  },
  {
    id: 'REPORT',
    name: 'Report Management',
    description: 'Report-related permissions',
    children: [
      {
        id: Permission.MANAGE_REPORT,
        name: 'Manage Reports',
        description: 'Full report management access',
        parent: 'REPORT',
        children: [
          {
            id: Permission.VIEW_FINANCIAL_REPORT,
            name: 'View Financial Report',
            parent: Permission.MANAGE_REPORT,
          },
          {
            id: Permission.VIEW_OCCUPANCY_REPORT,
            name: 'View Occupancy Report',
            parent: Permission.MANAGE_REPORT,
          },
          {
            id: Permission.VIEW_DEBT_REPORT,
            name: 'View Debt Report',
            parent: Permission.MANAGE_REPORT,
          },
        ],
      },
    ],
  },
  {
    id: 'TENANT',
    name: 'Tenant Actions',
    description: 'Tenant-specific permissions',
    children: [
      {
        id: Permission.TENANT_ACTIONS,
        name: 'Tenant Actions',
        description: 'Actions available to tenants',
        parent: 'TENANT',
        children: [
          {
            id: Permission.VIEW_OWN_CONTRACT,
            name: 'View Own Contract',
            parent: Permission.TENANT_ACTIONS,
          },
          {
            id: Permission.VIEW_OWN_INVOICE,
            name: 'View Own Invoice',
            parent: Permission.TENANT_ACTIONS,
          },
          {
            id: Permission.PAY_INVOICE,
            name: 'Pay Invoice',
            parent: Permission.TENANT_ACTIONS,
          },
          {
            id: Permission.CREATE_OWN_MAINTENANCE_REQUEST,
            name: 'Create Own Maintenance Request',
            parent: Permission.TENANT_ACTIONS,
          },
        ],
      },
    ],
  },
];
