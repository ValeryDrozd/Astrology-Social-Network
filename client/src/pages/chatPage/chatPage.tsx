import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { send } from 'node:process';
import React from 'react';
import { createRpcConnection } from '../../socket';
import chatStore from '../../stores/store';

class ChatPage extends React.Component {
  render(): JSX.Element {
    const { chats } = chatStore;

    const messageViews = chats?.length
      ? chats[0].messageList.map(
          (
            m: {
              text:
                | boolean
                | React.ReactChild
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
            },
            index: React.Key | null | undefined,
          ) => <p key={index}>{m.text}</p>,
        )
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
