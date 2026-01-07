import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  create(@Body() createCourseDto: any, @CurrentUser() user: any) {
    return this.coursesService.create(createCourseDto, user.userId);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('my-courses')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  findMyCourses(@CurrentUser() user: any) {
    return this.coursesService.findByInstructor(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: any,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.update(+id, updateCourseDto, user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.remove(+id, user.userId);
  }
}

