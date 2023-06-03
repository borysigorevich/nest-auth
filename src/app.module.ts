import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from './auth/auth.guard';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CustomersModule,
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOOSE_URL),
    AuthModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
