import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestContextService } from 'src/common/base/context/request-context.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

export interface CurrentUserPayload {
  userId: string;
  phoneNumber: string;
}

@Injectable()
export class CurrentUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Lấy thông tin user hiện tại từ JWT payload
   * @param payload JWT payload chứa userId và phoneNumber
   * @returns Thông tin user đầy đủ
   */
  async getCurrentUser(): Promise<User> {
    const userId = RequestContextService.getUserId();
    if (!userId) {
      throw new UnauthorizedException('Không tìm thấy thông tin user');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    return user;
  }

  /**
   * Lấy ID của user hiện tại
   * @param payload JWT payload
   * @returns User ID
   */
  getCurrentUserId(): string {
    const userId = RequestContextService.getUserId();
    if (!userId) {
      throw new UnauthorizedException('Không tìm thấy thông tin user');
    }
    return userId;
  }

  /**
   * Lấy thông tin user hiện tại với các trường cụ thể
   * @param payload JWT payload
   * @param selectFields Các trường cần lấy
   * @returns Thông tin user với các trường được chọn
   */
  async getCurrentUserWithFields(
    selectFields: (keyof User)[],
  ): Promise<Partial<User>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new UnauthorizedException('Không tìm thấy thông tin user');
    }

    const selectObject = selectFields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: selectObject,
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    return user;
  }
}
