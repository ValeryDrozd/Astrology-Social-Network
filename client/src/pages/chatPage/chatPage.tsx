import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import ChatBlock from '../../components/chat-block/chat-block';
import chatStore from '../../stores/store';

function ChatPage(): JSX.Element {
  const history = useHistory();
  useEffect(() => {
    if (
      chatStore.initialized &&
      (chatStore.user?.sex === null ||
        !chatStore.user?.zodiacSign ||
        !chatStore.user?.birthDate)
    ) {
      history.push('/extra-page');
    }
    console.log(chatStore.initialized);
    if (chatStore?.initialized && !chatStore?.user) {
      history.push('/login');
    }
  }, [history, chatStore?.user, chatStore.initialized]);

  return <ChatBlock />;
}

export default observer(ChatPage);
