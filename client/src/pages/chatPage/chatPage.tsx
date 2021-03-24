import { observer } from 'mobx-react';
import { send } from 'node:process';
import React from 'react';
import { createRpcConnection } from '../../socket';
import ChatStore from '../../stores/store';

class ChatPage extends React.Component<{ store: ChatStore }> {
  render(): JSX.Element {
    const { chats } = this.props.store;

    const messageViews = chats?.length
      ? chats[0].messageList.map((m, index) => <p key={index}>{m.text}</p>)
      : [];

    return (
      <div>
        <div>
          <p>Chat page</p>
          {messageViews}
        </div>
        <div></div>
      </div>
    );
  }
}

export default observer(ChatPage);
