import User, { UserUpdates } from 'interfaces/user';

export const UserRoute = 'users';
export const MyProfileRoute = 'me';
export const PatchMyProfileRoute = 'me';
export const UserByIDRoute = ':id';
export const GetRecommendationsRoute = 'recommendations';

export const FullMyProfileRoute = `/${UserRoute}/${MyProfileRoute}`;
export const FullUserByIDRoute = `/${UserRoute}/`; // + userID
export const FullPatchMyProfileRoute = `/${UserRoute}/${PatchMyProfileRoute}`;
export const FullGetRecommendationsRoute = `/${UserRoute}/${GetRecommendationsRoute}`;

export type MyProfileRouteResponse = User;
export type UserByIDRouteResponse = User;

export interface PatchMyProfileRouteProps {
  updates: UserUpdates;
}
export interface GetRecommendationsRouteQueryParams {
  sex?: boolean;
}
