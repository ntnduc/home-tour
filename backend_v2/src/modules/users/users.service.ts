import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('Số điện thoại đã được sử dụng!');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      isPhoneVerified: true,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByPhone(phone: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { phone: phone },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${phone} not found`);
    }
    return user;
  }
  async findUserUnVerify(phone: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { phone: phone, isPhoneVerified: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${phone} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
