import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    // Get user's first organization (or allow selection)
    const membership = await this.prisma.orgMember.findFirst({
      where: { userId: req.user.id },
      include: { organization: true },
    });
    if (!membership) {
      throw new Error('User has no organization');
    }
    return this.authService.login(req.user, membership.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return {
      user: req.user,
      organization: req.user.organization,
    };
  }
}
