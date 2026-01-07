import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  create(@Body() body: { courseId: number }, @CurrentUser() user: any) {
    return this.enrollmentsService.create(user.userId, body.courseId);
  }

  @Get('my-enrollments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  findMyEnrollments(@CurrentUser() user: any) {
    return this.enrollmentsService.findByStudent(user.userId);
  }

  @Get('course/:courseId')
  findEnrollmentsByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(+courseId);
  }

  @Delete(':courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  remove(@Param('courseId') courseId: string, @CurrentUser() user: any) {
    return this.enrollmentsService.remove(user.userId, +courseId);
  }
}

