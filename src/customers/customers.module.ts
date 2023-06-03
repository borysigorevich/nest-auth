import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomersController } from './controllers/customers/customers.controller';
import { ValidateCustomerMiddleware } from './middlewares/validate-customer.middleware';
import { CustomersService } from './services/customers/customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateCustomerMiddleware).forRoutes();
  }
}
