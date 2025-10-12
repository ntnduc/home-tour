import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import { Client } from '../entities/client.entity';

export class ClientDetailDto extends BaseDetailDto<Client> {
  fullName: string;
  phoneNumber: string;
  email?: string;
  idCardNumber?: string;
  permanentAddress?: string;
  dateOfBirth?: Date;
  profilePictureURL?: string;
  isActive: boolean;
  notes?: string;

  fromEntity(entity: Client): void {
    this.id = entity.id;
    this.fullName = entity.fullName;
    this.phoneNumber = entity.phoneNumber;
    this.email = entity.email;
    this.idCardNumber = entity.idCardNumber;
    this.permanentAddress = entity.permanentAddress;
    this.dateOfBirth = entity.dateOfBirth;
    this.profilePictureURL = entity.profilePictureURL;
    this.isActive = entity.isActive;
    this.notes = entity.notes;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
  }
}

