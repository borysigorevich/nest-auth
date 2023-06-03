import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../../../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../../../common/guards/refreshToken.guard';
import { PublicDecorator } from '../../decorators/Public.decorator';
import { SignInDto } from '../../dtos/SignIn.dto';
import { SignUpDto } from '../../dtos/SignUp.dto';
import { AuthService } from '../../services/auth/auth.service';
import { RefreshTokenStrategy } from '../../strategies/refreshToken.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @SetMetadata('isPublic', true)
  @PublicDecorator()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UsePipes(ValidationPipe)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @PublicDecorator()
  @Post('/register')
  @UsePipes(ValidationPipe)
  async signUp(@Body() user: SignUpDto) {
    const createdUser = await this.authService.signUp(user);
    if (createdUser) return createdUser;
    throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  async logout(@Req() request: Request) {
    await this.authService.logout(request.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(@Req() request: Request) {
    console.log('refresh token controller');
    const userId = request.user['sub'];
    const refreshToken = request.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
