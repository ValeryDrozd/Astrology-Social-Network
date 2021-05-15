export const ChatRoute = 'chats';
export const CreateNewChatRoute = 'new';

export const FullCreateNewChatRoute = `/${ChatRoute}/${CreateNewChatRoute}`;

export interface CreateNewChatRouteProps {
  memberID: string;
}
