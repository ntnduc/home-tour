import { BaseEntity } from 'src/common/base/Entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  permissionName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany('RolePermission', 'permission')
  rolePermissions: any[];
}
