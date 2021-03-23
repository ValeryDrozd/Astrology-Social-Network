import React from 'react';
import { createRpcConnection } from '../../socket';

class ChatPage extends React.Component {
  state: { messages: { text: string }[] } = {
    messages: [],
  };

  async componentDidMount(): Promise<void> {
    const rpcConnection = await createRpcConnection();
    const messages = await rpcConnection.call('getMessages');
    this.setState({ messages });
    console.log();
  }

  render(): JSX.Element {
    const { messages } = this.state;
    return (
      <div>
        <div>
          <p>Chat page</p>
          {messages.map((m) => (
            <p>{m.text}</p>
          ))}
        </div>
        <div></div>
      </div>
    );
  }
}

export default ChatPage;
