import { IsDateString, IsString } from 'class-validator';
import { BaseListDto } from '../../../common/base/dto/list.dto';
import { Client } from '../entities/client.entity';

export class ClientListDto extends BaseListDto<Client> {
  fromEntity(entity: Client): void {
    this.id = entity.id;
    this.fullName = entity.fullName;
    this.dateOfBirth = entity.dateOfBirth;
    this.profilePictureURL = entity.profilePictureURL;
    this.notes = entity.notes;
  }

  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth?: Date;

  @IsString()
  profilePictureURL?: string;

  @IsString()
  notes?: string;
}
