import { Injectable } from '@nestjs/common';
import { Customer } from '../../types/Customer';

@Injectable()
export class CustomersService {
  private customers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'some email',
    },
    {
      id: 2,
      name: 'John Doe1',
      email: 'some email1',
    },
    {
      id: 3,
      name: 'John Doe2',
      email: 'some email2',
    },
  ];

  findCustomers() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'some email',
    };
  }

  getAllCustomer() {
    return this.customers;
  }

  findCustomerById(id: number) {
    return this.customers.find((user) => user.id === id);
  }

  createCustomer(customer: Customer) {
    this.customers.push(customer);
  }
}
