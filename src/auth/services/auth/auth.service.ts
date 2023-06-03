import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../users/services/users/users.service';
import { User } from '../../../users/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) return new NotFoundException();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return new UnauthorizedException();

    const userId = user._id.toString();

    // const payload = { sub: userId, username: user.username };

    const tokens = await this.getTokens(userId, user.username);

    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;

    // return {
    //   access_token: await this.jwtService.signAsync(payload, {
    //     secret: this.configService.get('JWT_ACCESS_SECRET'),
    //   }),
    // };
  }

  async signUp(user: User) {
    const newUser = await this.userService.createUser(user);

    const userId = newUser._id.toString();
    const tokens = await this.getTokens(userId, newUser.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Forbidden');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Forbidden');
    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15s',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
