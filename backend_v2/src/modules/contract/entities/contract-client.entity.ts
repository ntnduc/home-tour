import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Client } from 'src/modules/client/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_client')
@Unique(['contractId', 'clientId'])
export class ContractClient extends BaseEntity {
  @ManyToOne(() => Contracts, (contract) => contract.contractClient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  contractId: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ default: '' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ default: false })
  @IsBoolean()
  @IsNotEmpty()
  isLandlordClient: boolean;

  @Column()
  clientId: string;

  @Column({ type: 'date', nullable: true })
  moveInDate?: Date;

  @Column({ type: 'date', nullable: true })
  moveOutDate?: Date;

  @Column({ default: true })
  isActiveInContract: boolean;
}
