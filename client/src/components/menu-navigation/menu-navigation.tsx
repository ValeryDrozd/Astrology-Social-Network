import { useHistory } from 'react-router-dom';
import { logout } from 'services/auth.service';
import chatStore, { reloadChatStore } from 'stores/store';
import { ListItem, NavigationBarBlock } from './styles';
export default function NavigationBar(): JSX.Element {
  const history = useHistory();
  return (
    <NavigationBarBlock>
      <ListItem
        onClick={(): void => history.push(`/users/${chatStore.user.userID}`)}
      >
        Profile
      </ListItem>
      <ListItem onClick={(): void => history.push('/chat')}>Chats</ListItem>
      <ListItem
        onClick={async (): Promise<void> => {
          await logout();
          reloadChatStore();
          window.location.reload();
        }}
      >
        Logout
      </ListItem>
    </NavigationBarBlock>
  );
}
