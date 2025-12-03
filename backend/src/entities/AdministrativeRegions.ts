import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("administrative_regions")
export class AdministrativeRegions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column()
  codeName: string;

  @Column()
  codeNameEn: string;
}
