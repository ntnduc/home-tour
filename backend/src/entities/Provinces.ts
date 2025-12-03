import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryColumn } from "typeorm/decorator/columns/PrimaryColumn";
import { Entity } from "typeorm/decorator/entity/Entity";
import { JoinColumn } from "typeorm/decorator/relations/JoinColumn";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { AdministrativeRegions } from "./AdministrativeRegions";
import { AdministrativeUnit } from "./AdministrativeUnit";

@Entity("provinces")
export class Provinces {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column()
  fullName: string;

  @Column()
  fullNameEn: string;

  @Column()
  codeName: string;

  @Column({ nullable: true })
  administrativeUnitId: number;

  @Column({ nullable: true })
  administrativeRegionId: number;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: "administrative_unit_id" })
  administrativeUnit: AdministrativeUnit | null;

  @ManyToOne(() => AdministrativeRegions)
  @JoinColumn({ name: "administrative_region_id" })
  administrativeRegion: AdministrativeRegions | null;
}
