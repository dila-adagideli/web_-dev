import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async create(studentId: number, courseId: number): Promise<Enrollment> {
    const existing = await this.enrollmentsRepository.findOne({
      where: { studentId, courseId },
    });
    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }
    const enrollment = this.enrollmentsRepository.create({ studentId, courseId });
    return this.enrollmentsRepository.save(enrollment);
  }

  async findByStudent(studentId: number): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { studentId },
      relations: ['course', 'course.instructor', 'course.categories'],
    });
  }

  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { courseId },
      relations: ['student'],
    });
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async remove(studentId: number, courseId: number): Promise<void> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { studentId, courseId },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    await this.enrollmentsRepository.remove(enrollment);
  }
}

