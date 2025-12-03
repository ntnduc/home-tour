import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('administrative_regions')
export class AdministrativeRegions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  name_en: string;

  @Column()
  code_name: string;

  @Column()
  code_name_en: string;
}
