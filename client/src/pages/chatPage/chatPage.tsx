import { observer } from 'mobx-react';
import { send } from 'node:process';
import React from 'react';
import { createRpcConnection } from '../../socket';
import ChatStore from '../../stores/store';

interface Message {
  text: string;
  time: string;
  id: string;
}

async function sendMessage(): Promise<void> {
  const message = {
    text: 'asadasd',
    time: new Date().toLocaleTimeString(),
  };
  const socket = await createRpcConnection();
  socket.call<{ ok: boolean }>('addNewMessage', message);
}
// setInterval(sendMessage, 60000);

class ChatPage extends React.Component<{ store: ChatStore }> {
  state: { messages: { text: string }[] } = {
    messages: [],
  };

  async componentDidMount(): Promise<void> {
    // console.log('laslkdlasdklasdk');
    // const rpcConnection = await createRpcConnection();
    // console.log(await rpcConnection.call('getMessages'));
    // const messages = await rpcConnection.call('getMessages');
    // console.log(await rpcConnection.call('getMessages'));
    // this.setState({ messages });
    // console.log('laslkdlasdklasdk');
  }

  render(): JSX.Element {
    const { chats } = this.props.store;
    const { messages } = this.state;

    const messageViews = chats?.length
      ? chats[0].messageList.map((m) => <p>{m.text}</p>)
      : [];

    console.log(this.props.store.number);
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
