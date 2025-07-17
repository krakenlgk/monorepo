import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { validateCreateUserInput, validateUpdateUserInput } from '@monorepo/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Validate input using shared validation
    const validationErrors = validateCreateUserInput(userData as any);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    // Validate input using shared validation
    const validationErrors = validateUpdateUserInput(userData as any);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }
}