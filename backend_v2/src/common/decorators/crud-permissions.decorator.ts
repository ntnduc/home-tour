import { RequirePermissions } from '../../modules/rbac/decorators/permissions.decorator';
import { Permission } from '../enums/role.enum';

/**
 * Apply CRUD permissions based on permission node ID
 */
export function CrudPermissions(permissionNodeId: string) {
  return {
    Create: () =>
      RequirePermissions(`${permissionNodeId}.CREATE` as Permission),
    View: () => RequirePermissions(`${permissionNodeId}.VIEW` as Permission),
    Edit: () => RequirePermissions(`${permissionNodeId}.EDIT` as Permission),
    Delete: () =>
      RequirePermissions(`${permissionNodeId}.DELETE` as Permission),
    Manage: () =>
      RequirePermissions(`${permissionNodeId}.MANAGE` as Permission),
  };
}

export function AutoCrudPermissions(permissionNodeId: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const permissions = CrudPermissions(permissionNodeId);

    const prototype = constructor.prototype;

    if (prototype.create) {
      permissions.Create()(
        prototype,
        'create',
        Object.getOwnPropertyDescriptor(prototype, 'create')!,
      );
    }

    if (prototype.get) {
      permissions.View()(
        prototype,
        'get',
        Object.getOwnPropertyDescriptor(prototype, 'get')!,
      );
    }

    if (prototype.getAll) {
      permissions.View()(
        prototype,
        'getAll',
        Object.getOwnPropertyDescriptor(prototype, 'getAll')!,
      );
    }

    if (prototype.update) {
      permissions.Edit()(
        prototype,
        'update',
        Object.getOwnPropertyDescriptor(prototype, 'update')!,
      );
    }

    if (prototype.delete) {
      permissions.Delete()(
        prototype,
        'delete',
        Object.getOwnPropertyDescriptor(prototype, 'delete')!,
      );
    }

    return constructor;
  };
}

/**
 * Individual CRUD permission decorators
 */
export const CreatePermission = (permissionNodeId: string) =>
  RequirePermissions(`${permissionNodeId}.CREATE` as Permission);

export const ViewPermission = (permissionNodeId: string) =>
  RequirePermissions(`${permissionNodeId}.VIEW` as Permission);

export const EditPermission = (permissionNodeId: string) =>
  RequirePermissions(`${permissionNodeId}.EDIT` as Permission);

export const DeletePermission = (permissionNodeId: string) =>
  RequirePermissions(`${permissionNodeId}.DELETE` as Permission);

export const ManagePermission = (permissionNodeId: string) =>
  RequirePermissions(`${permissionNodeId}.MANAGE` as Permission);
