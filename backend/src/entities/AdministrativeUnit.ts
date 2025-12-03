import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("administrative_units")
export class AdministrativeUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  fullNameEn: string;

  @Column()
  shortName: string;

  @Column()
  shortNameEn: string;

  @Column()
  codeName: string;

  @Column()
  codeNameEn: string;
}
