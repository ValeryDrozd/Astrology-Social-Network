import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { UsersService } from './users.service';
import {
  ChangeMyPasswordRoute,
  ChangeMyPasswordRouteProps,
  GetRecommendationsRoute,
  GetRecommendationsRouteQueryParams,
  MyProfileRoute,
  MyProfileRouteResponse,
  PatchMyProfileRoute,
  UserByIDRoute,
  UserByIDRouteResponse,
  UserRoute,
} from '@interfaces/routes/user-routes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtValidationOutput } from '../auth/strateries/jwt.strategy';
import { UserUpdates, UserWithCompatibility } from '@interfaces/user';
import sendTokensPair from 'src/helpers/send-tokens-pair';

@Controller(UserRoute)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(MyProfileRoute)
  async getMyProfile(
    @Request() { user }: JwtValidationOutput,
  ): Promise<MyProfileRouteResponse> {
    return await this.usersService.findById(user.userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get(GetRecommendationsRoute)
  async getRecommendations(
    @Request() { user }: JwtValidationOutput,
    @Query() { sex }: GetRecommendationsRouteQueryParams,
  ): Promise<UserWithCompatibility[]> {
    return await this.usersService.getRecommendations(user.userID, sex);
  }

  @UseGuards(JwtAuthGuard)
  @Get(UserByIDRoute)
  async getUserGyID(@Param('id') userID: string): Promise<UserByIDRouteResponse> {
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

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(ChangeMyPasswordRoute)
  async changePassword(
    @Request() { user }: JwtValidationOutput,
    @Body() { oldPassword, newPassword, astrologicalToken }: ChangeMyPasswordRouteProps,
    @Req() { headers }: ExpressRequest,
    @Res() res: Response,
  ): Promise<void> {
    const userAgent = String(headers['user-agent']);
    const pair = await this.usersService.changePassword(
      user.userID,
      oldPassword,
      newPassword,
      astrologicalToken,
      userAgent,
    );

    sendTokensPair(res, pair);
  }
}
