import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { AdministrativeRegions } from './AdministrativeRegions.entity';
import { AdministrativeUnit } from './AdministrativeUnit.entity';

@Entity('provinces')
export class Provinces {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  name_en: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255 })
  full_name_en: string;

  @Column({ type: 'varchar', length: 255 })
  code_name: string;

  @Column({ nullable: true })
  administrative_unit_id: number;

  @Column({ nullable: true })
  administrative_region_id: number;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit | null;

  @ManyToOne(() => AdministrativeRegions)
  @JoinColumn({ name: 'administrative_region_id' })
  administrativeRegion: AdministrativeRegions | null;
}
