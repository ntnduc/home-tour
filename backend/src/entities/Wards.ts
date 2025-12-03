import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AdministrativeUnit } from "./AdministrativeUnit";
import { Districts } from "./Districts";

@Entity("wards")
export class Wards {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  nameEn: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  fullNameEn: string;

  @Column({ nullable: true })
  codeName: string;

  @Column({ nullable: true })
  districtCode: string;

  @Column({ nullable: true })
  administrativeUnitId: number;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: "administrative_unit_id" })
  administrativeUnit: AdministrativeUnit | null;

  @ManyToOne(() => Districts)
  @JoinColumn({ name: "district_code" })
  district: Districts | null;
}
