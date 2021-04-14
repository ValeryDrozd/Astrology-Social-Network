import User, { UserUpdates } from '../user';

export const UserRoute = 'users';
export const MyProfileRoute = 'me';
export const PatchMyProfileRoute = 'me';
export const UserByIDRoute = ':id';

export const FullMyProfileRoute = `/${UserRoute}/${MyProfileRoute}`;
export const FullUserByIDRoute = `/${UserRoute}/`; // + userID
export const FullPatchMyProfileRoute = `/${UserRoute}/${PatchMyProfileRoute}`;

export interface StandardAccessProps {
  accessToken: string;
}

export type MyProfileRouteProps = StandardAccessProps;
export type MyProfileRouteResponse = User;

export type UserByIDRouteProps = StandardAccessProps;
export type UserByIDRouteResponse = User;

export interface PatchMyProfileRouteProps extends StandardAccessProps {
  updates: UserUpdates;
}
