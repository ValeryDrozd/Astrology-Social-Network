import User, { UserUpdates } from '../user';

export const UserRoute = 'users';
export const MyProfileRoute = 'me';
export const PatchMyProfileRoute = 'me';
export const UserByIDRoute = ':id';

export const FullMyProfileRoute = `/${UserRoute}/${MyProfileRoute}`;
export const FullUserByIDRoute = `/${UserRoute}/`; // + userID
export const FullPatchMyProfileRoute = `/${UserRoute}/${PatchMyProfileRoute}`;

export type MyProfileRouteResponse = User;
export type UserByIDRouteResponse = User;

export interface PatchMyProfileRouteProps {
  updates: UserUpdates;
}
