import { observer } from 'mobx-react';
import ChatBlock from '../../components/chat-block/chat-block';

function ChatPage(): JSX.Element {
  return (
    <div>
      <ChatBlock />
    </div>
  );
}

export default observer(ChatPage);
