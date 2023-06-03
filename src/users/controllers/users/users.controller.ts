import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccessTokenStrategy } from '../../../auth/strategies/accessToken.strategy';
import { AccessTokenGuard } from '../../../common/guards/accessToken.guard';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UserNotFoundException } from '../../exceptions/UserNotFound.exception';
import { HttpExceptionFilter } from '../../filters/HttpException.filter';
import { UsersService } from '../../services/users/users.service';
import { SerializedUser, User } from '../../types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('')
  // getAllUsers(): User[] {
  //   return this.usersService.getUsers();
  // }
  //
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('/username/:username')
  // getUserByUsername(@Param('username') username: string): User {
  //   const user = this.usersService.findUserByUsername(username) || null;
  //   if (user) return new SerializedUser(user);
  //   throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  // }

  @Post('')
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: CreateUserDto) {
    const createdUser = await this.usersService.createUser(user);
    // if (createdUser) return new SerializedUser(createdUser);
    if (createdUser) return createdUser;
    throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseFilters(HttpExceptionFilter)
  // @Get('id/:id')
  // getUserById(@Param('id') id: string) {
  //   const user = this.usersService.getUserById(id);
  //   if (user) return new SerializedUser(user);
  //   throw new UserNotFoundException(`User with id ${id} not found`);
  // }
}
