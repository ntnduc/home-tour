import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AdministrativeUnit } from "./AdministrativeUnit";
import { Provinces } from "./Provinces";

@Entity("districts")
export class Districts {
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
  provinceCode: string;

  @Column({ nullable: true })
  administrativeUnitId: number;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: "administrative_unit_id" })
  administrativeUnit: AdministrativeUnit | null;

  @ManyToOne(() => Provinces)
  @JoinColumn({ name: "province_code" })
  province: Provinces | null;
}
