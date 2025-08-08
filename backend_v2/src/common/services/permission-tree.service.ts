import { Injectable } from '@nestjs/common';
import { PERMISSION_TREE } from '../constants/permission-tree.constant';
import { Permission, PermissionNode } from '../types/permission-tree.type';

@Injectable()
export class PermissionTreeService {
  private permissionMap: Map<string, PermissionNode> = new Map();

  constructor() {
    this.buildPermissionMap();
  }

  /**
   * Build a flat map of all permissions for quick lookup
   */
  private buildPermissionMap(): void {
    const addToMap = (node: PermissionNode) => {
      this.permissionMap.set(node.id, node);
      if (node.children) {
        node.children.forEach((child) => addToMap(child));
      }
    };

    PERMISSION_TREE.forEach((rootNode) => addToMap(rootNode));
  }

  /**
   * Get the full permission tree
   */
  getPermissionTree(): PermissionNode[] {
    return PERMISSION_TREE;
  }

  /**
   * Get a specific permission node by ID
   */
  getPermission(permissionId: string): PermissionNode | undefined {
    return this.permissionMap.get(permissionId);
  }

  /**
   * Get all child permissions of a parent permission
   */
  getChildPermissions(parentId: string): Permission[] {
    const parent = this.permissionMap.get(parentId);
    if (!parent || !parent.children) {
      return [];
    }

    const collectChildren = (node: PermissionNode): Permission[] => {
      const children: Permission[] = [];
      if (node.children) {
        node.children.forEach((child) => {
          children.push(child.id as Permission);
          children.push(...collectChildren(child));
        });
      }
      return children;
    };

    return collectChildren(parent);
  }

  /**
   * Check if a user has permission (including inherited permissions)
   */
  hasPermission(
    userPermissions: string[],
    requiredPermission: string,
  ): boolean {
    // Direct permission check
    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Check if user has parent permission that includes this permission
    const permission = this.permissionMap.get(requiredPermission);
    if (!permission || !permission.parent) {
      return false;
    }

    // Recursively check parent permissions
    return this.hasPermission(userPermissions, permission.parent);
  }

  /**
   * Expand permissions to include all child permissions
   */
  expandPermissions(permissions: string[]): string[] {
    const expandedPermissions = new Set<string>(permissions);

    permissions.forEach((permission) => {
      const childPermissions = this.getChildPermissions(permission);
      childPermissions.forEach((child) => expandedPermissions.add(child));
    });

    return Array.from(expandedPermissions);
  }

  /**
   * Get permissions by category/module
   */
  getPermissionsByCategory(category: string): PermissionNode | undefined {
    return PERMISSION_TREE.find((node) => node.id === category.toUpperCase());
  }

  /**
   * Get all leaf permissions (permissions without children)
   */
  getLeafPermissions(): Permission[] {
    const leafPermissions: Permission[] = [];

    const collectLeaves = (node: PermissionNode) => {
      if (!node.children || node.children.length === 0) {
        leafPermissions.push(node.id as Permission);
      } else {
        node.children.forEach((child) => collectLeaves(child));
      }
    };

    PERMISSION_TREE.forEach((rootNode) => collectLeaves(rootNode));
    return leafPermissions;
  }

  /**
   * Get permission hierarchy path
   */
  getPermissionPath(permissionId: string): string[] {
    const path: string[] = [];
    let current = this.permissionMap.get(permissionId);

    while (current) {
      path.unshift(current.id);
      current = current.parent
        ? this.permissionMap.get(current.parent)
        : undefined;
    }

    return path;
  }

  /**
   * Validate if permissions are valid
   */
  validatePermissions(permissions: string[]): {
    valid: string[];
    invalid: string[];
  } {
    const valid: string[] = [];
    const invalid: string[] = [];

    permissions.forEach((permission) => {
      if (this.permissionMap.has(permission)) {
        valid.push(permission);
      } else {
        invalid.push(permission);
      }
    });

    return { valid, invalid };
  }
}
