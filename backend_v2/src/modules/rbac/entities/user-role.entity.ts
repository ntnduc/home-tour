import { Properties } from 'src/modules/property/entities/properties.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  roleId: string;

  @PrimaryColumn('uuid')
  propertyId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedDate: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;
}
