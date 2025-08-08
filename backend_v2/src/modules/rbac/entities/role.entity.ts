import { BaseEntity } from 'src/common/base/Entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  roleName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany('RolePermission', 'role')
  rolePermissions: any[];

  @OneToMany('UserRole', 'role')
  userRoles: any[];
}
