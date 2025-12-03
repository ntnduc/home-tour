import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AdministrativeUnit } from './AdministrativeUnit.entity';
import { Provinces } from './Provinces.entity';

@Entity('districts')
export class Districts {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @Column({ nullable: true })
  province_code: string;

  @Column({ nullable: true })
  administrative_unit_id: number;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit | null;

  @ManyToOne(() => Provinces)
  @JoinColumn({ name: 'province_code' })
  province: Provinces | null;
}
