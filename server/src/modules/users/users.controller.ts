import { Body, Controller, Get, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import {
  MyProfileRoute,
  MyProfileRouteResponse,
  PatchMyProfileRoute,
  UserByIDRoute,
  UserByIDRouteResponse,
  UserRoute,
} from '@interfaces/routes/user-routes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtValidationOutput } from '../auth/strateries/jwt.strategy';
import { UserUpdates } from '@interfaces/user';

@Controller(UserRoute)
export class UsersController {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @Get(MyProfileRoute)
  async getMyProfile(
    @Request() { user }: JwtValidationOutput,
  ): Promise<MyProfileRouteResponse> {
    return await this.usersService.findById(user.userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get(UserByIDRoute)
  async getUserGyID(@Query('userID') userID: string): Promise<UserByIDRouteResponse> {
    return await this.usersService.findById(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(PatchMyProfileRoute)
  async patchUserProfile(
    @Request() { user }: JwtValidationOutput,
    @Body('updates') updates: UserUpdates,
  ): Promise<void> {
    await this.usersService.patchUser(user.userID, updates);
  }
}
