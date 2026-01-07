import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    private coursesService: CoursesService,
  ) {}

  async create(createLessonDto: Partial<Lesson>, instructorId: number): Promise<Lesson> {
    const course = await this.coursesService.findOne(createLessonDto.courseId);
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }
    const lesson = this.lessonsRepository.create(createLessonDto);
    return this.lessonsRepository.save(lesson);
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonsRepository.find({
      relations: ['course'],
    });
  }

  async findByCourse(courseId: number): Promise<Lesson[]> {
    return this.lessonsRepository.find({
      where: { courseId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: number, updateLessonDto: Partial<Lesson>, instructorId: number): Promise<Lesson> {
    const lesson = await this.findOne(id);
    const course = await this.coursesService.findOne(lesson.courseId);
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only update lessons in your own courses');
    }
    Object.assign(lesson, updateLessonDto);
    return this.lessonsRepository.save(lesson);
  }

  async remove(id: number, instructorId: number): Promise<void> {
    const lesson = await this.findOne(id);
    const course = await this.coursesService.findOne(lesson.courseId);
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only delete lessons from your own courses');
    }
    await this.lessonsRepository.remove(lesson);
  }
}

