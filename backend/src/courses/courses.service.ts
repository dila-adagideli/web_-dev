import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCourseDto: any, instructorId: number): Promise<Course> {
    const { categories, ...courseData } = createCourseDto;
    
    let categoryEntities: Category[] = [];
    if (categories && categories.length > 0) {
      const categoryIds = categories.map((cat: any) => cat.id);
      categoryEntities = await this.categoriesRepository.find({
        where: categoryIds.map((id: number) => ({ id })),
      });
    }
    
    const course = this.coursesRepository.create({
      ...courseData,
      instructorId,
      categories: categoryEntities,
    });
    
    const savedCourse = await this.coursesRepository.save(course);
    return savedCourse as unknown as Course;
  }

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({
      relations: ['instructor', 'categories', 'lessons'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['instructor', 'categories', 'lessons'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async findByInstructor(instructorId: number): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { instructorId },
      relations: ['categories', 'lessons'],
    });
  }

  async update(id: number, updateCourseDto: Partial<Course>, instructorId: number): Promise<Course> {
    const course = await this.findOne(id);
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only update your own courses');
    }
    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  async remove(id: number, instructorId: number): Promise<void> {
    const course = await this.findOne(id);
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only delete your own courses');
    }
    await this.coursesRepository.remove(course);
  }
}

