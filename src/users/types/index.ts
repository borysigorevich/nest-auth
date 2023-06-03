import { Exclude } from 'class-transformer';

export type User = {
  email: string;
  username: string;
  password: string;
  refreshToken: string;
};

export class SerializedUser {
  username: string;

  email: string;

  @Exclude()
  password: string;

  refreshToken: string;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
