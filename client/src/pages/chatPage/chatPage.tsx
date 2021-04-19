import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import ChatBlock from '../../components/chat-block/chat-block';
import chatStore from '../../stores/store';

function ChatPage(): JSX.Element {
  const history = useHistory();
  if (
    chatStore.initialized &&
    (!chatStore.user?.sex ||
      !chatStore.user?.zodiacSign ||
      !chatStore.user?.birthDate)
  ) {
    history.push('/extra-page');
  }
  return (
    <div>
      <ChatBlock />
    </div>
  );
}

export default observer(ChatPage);
