// src/user/user.controller.ts
import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; 
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

interface RequestWithUser extends Request {
  user: {
    id: number;
    nome: string;
  };
}
// ------------------------------------

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('perfil')
  getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id; 
    return this.userService.findProfile(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('perfil')
  updateProfile(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.updateProfile(userId, updateUserDto);
  }
}