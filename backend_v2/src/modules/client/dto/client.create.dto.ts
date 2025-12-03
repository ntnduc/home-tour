import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseCreateDto } from '../../../common/base/dto/create.dto';
import { Client } from '../entities/client.entity';

export class ClientCreateDto extends BaseCreateDto<Client> {
  @IsString()
  @Length(1, 255)
  fullName: string;

  @IsString()
  @Length(8, 20)
  phoneNumber: string;

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

  getEntity(): Client {
    const entity = new Client();
    entity.fullName = this.fullName;
    entity.phoneNumber = this.phoneNumber;
    entity.email = this.email;
    entity.idCardNumber = this.idCardNumber;
    entity.permanentAddress = this.permanentAddress;
    entity.dateOfBirth = this.dateOfBirth
      ? new Date(this.dateOfBirth)
      : undefined;
    entity.profilePictureURL = this.profilePictureURL;
    entity.isActive = this.isActive ?? true;
    entity.notes = this.notes;
    return entity;
  }
}

