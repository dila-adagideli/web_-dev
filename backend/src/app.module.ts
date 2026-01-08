import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { CategoriesModule } from './categories/categories.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { User } from './users/entities/user.entity';
import { Course } from './courses/entities/course.entity';
import { Lesson } from './lessons/entities/lesson.entity';
import { Category } from './categories/entities/category.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'course_management',
      entities: [User, Course, Lesson, Category, Enrollment],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    CategoriesModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}

