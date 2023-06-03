import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCustomerDto } from '../../dtos/CreateCustomer.dto';
import { CustomersService } from '../../services/customers/customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('')
  getCustomers() {
    return this.customersService.getAllCustomer();
  }

  @Get(':id')
  getCustomerById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const customer = this.customersService.findCustomerById(1);

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  }

  @Get('/search/:id')
  getCustomerByIdNew(@Param('id', ParseIntPipe) id: number) {
    const customer = this.customersService.findCustomerById(id);
    if (customer) {
      return customer;
    } else {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('')
  @UsePipes(ValidationPipe)
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    this.customersService.createCustomer(createCustomerDto);
    return createCustomerDto;
  }
}
