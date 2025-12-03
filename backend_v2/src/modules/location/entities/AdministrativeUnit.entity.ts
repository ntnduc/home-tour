import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('administrative_units')
export class AdministrativeUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  full_name_en: string;

  @Column()
  short_name: string;

  @Column()
  code_name: string;

  @Column()
  short_name_en: string;

  @Column()
  code_name_en: string;
}
