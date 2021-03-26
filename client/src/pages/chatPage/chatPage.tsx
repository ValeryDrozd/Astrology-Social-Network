import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import React from 'react';
import WebSocketClient from '../../socket';
import chatStore from '../../stores/store';
import { create } from 'node:domain';
import Message from '../../interfaces/message';

class ChatPage extends React.Component {
  render(): JSX.Element {
    const { chats } = chatStore;

    const messageViews = chats?.length
      ? chats[0].messageList.map((m: Message, index: number) => (
          <p key={index}>{m.text}</p>
        ))
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
