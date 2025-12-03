import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseUpdateDto } from '../../../common/base/dto/update.dto';
import { Client } from '../entities/client.entity';

export class ClientUpdateDto extends BaseUpdateDto<Client> {
  @IsString()
  @Length(1, 255)
  @IsOptional()
  fullName?: string;

  @IsString()
  @Length(8, 20)
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  idCardNumber?: string;

  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  profilePictureURL?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  getEntity(entity: Client): Client {
    if (this.fullName !== undefined) entity.fullName = this.fullName;
    if (this.phoneNumber !== undefined) entity.phoneNumber = this.phoneNumber;
    if (this.email !== undefined) entity.email = this.email;
    if (this.idCardNumber !== undefined)
      entity.idCardNumber = this.idCardNumber;
    if (this.permanentAddress !== undefined)
      entity.permanentAddress = this.permanentAddress;
    if (this.dateOfBirth !== undefined)
      entity.dateOfBirth = this.dateOfBirth
        ? new Date(this.dateOfBirth)
        : undefined;
    if (this.profilePictureURL !== undefined)
      entity.profilePictureURL = this.profilePictureURL;
    if (this.isActive !== undefined) entity.isActive = this.isActive;
    if (this.notes !== undefined) entity.notes = this.notes;
    return entity;
  }
}
