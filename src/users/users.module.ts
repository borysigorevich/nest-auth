import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from '../auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../auth/strategies/refreshToken.strategy';
import { UsersController } from './controllers/users/users.controller';
import { UserClass, UserSchema } from './schemas/User.schema';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserClass.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
