import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from 'services/auth.service';
import chatStore, { reloadChatStore } from 'stores/store';
import { ListItem, NavigationBarBlock } from './styles';
export default function NavigationBar(): JSX.Element {
  const [route, setRoute] = useState(`/users/${chatStore.user.userID}`);
  const history = useHistory();
  useEffect(() => {
    setRoute(history.location.pathname);
  }, [history.location.pathname]);

  if (history.location.pathname === '/extra-page') return <></>;

  return (
    <NavigationBarBlock>
      <ListItem
        className={
          route === `/users/${chatStore.user.userID}` ? 'selected' : ''
        }
        onClick={(): void => {
          const newRoute = `/users/${chatStore.user.userID}`;
          history.push(newRoute);
          setRoute(newRoute);
        }}
      >
        Profile
      </ListItem>
      <ListItem
        className={route === `/chat` ? 'selected' : ''}
        onClick={(): void => {
          const newRoute = '/chat';
          history.push(newRoute);
          setRoute(newRoute);
        }}
      >
        Chats
      </ListItem>
      <ListItem
        className={route === `/recommendation` ? 'selected' : ''}
        onClick={(): void => {
          const newRoute = '/recommendation';
          history.push(newRoute);
          setRoute(newRoute);
        }}
      >
        Recommendation
      </ListItem>
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
