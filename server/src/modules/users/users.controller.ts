import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import {
  FullPatchMyProfileRoute,
  MyProfileRoute,
  MyProfileRouteResponse,
  PatchMyProfileRouteProps,
  StandardAccessProps,
  UserByIDRoute,
  UserByIDRouteResponse,
  UserRoute,
} from '@interfaces/routes/user-routes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller(UserRoute)
export class UsersController {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  @Get(MyProfileRoute)
  async getMyProfile(
    @Query() { accessToken }: StandardAccessProps,
  ): Promise<MyProfileRouteResponse> {
    console.log(accessToken);
    console.log('Kuku');
    const { userID } = this.jwtService.verify<{ userID: string }>(accessToken);
    return await this.usersService.findById(userID);
  }

  @Get(UserByIDRoute)
  async getUserGyID(
    @Query('userID') userID: string,
    @Body() { accessToken }: StandardAccessProps,
  ): Promise<UserByIDRouteResponse> {
    this.jwtService.verify(accessToken);
    return await this.usersService.findById(userID);
  }

  @Patch(FullPatchMyProfileRoute)
  async patchUserProfile(
    @Body() { accessToken, updates }: PatchMyProfileRouteProps,
  ): Promise<void> {
    const { userID } = this.jwtService.verify<{ userID: string }>(accessToken);
    await this.usersService.patchUser(userID, updates);
  }
}
