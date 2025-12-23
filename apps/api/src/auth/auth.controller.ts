import { Controller, Post, Body, Get, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from '../common/dto/auth.dto';
import { User } from '../common/types/user.types';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User }) {
    // Get user's first organization (or allow selection)
    const membership = await this.prisma.orgMember.findFirst({
      where: { userId: req.user.id },
      include: { organization: true },
    });
    if (!membership) {
      throw new HttpException('User has no organization', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(req.user, membership.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: { user: User }) {
    return {
      user: req.user,
      organization: req.user.organization,
    };
  }
}
