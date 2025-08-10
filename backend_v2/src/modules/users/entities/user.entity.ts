import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { Properties } from '../../property/entities/properties.entity';
import { UserRole } from '../../rbac/entities/user-role.entity';
@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Properties, (property) => property.owner)
  properties: Properties[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
