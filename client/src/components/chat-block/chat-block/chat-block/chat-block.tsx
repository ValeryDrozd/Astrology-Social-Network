import { observer } from 'mobx-react';
import React, { useState } from 'react';
import chatStore from '../../../../stores/store';
import {
  ChatBlockView,
  ChatItem,
  ChatList,
  MessageItem,
  MessageList,
  MessageView,
} from './styles';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import axios from 'axios';
import getFingerprint from '../../../../helpers/get-fingerprint';

const ChatBlock = (): JSX.Element => {
  const [currentChatId, setCurrentChatId] = useState<string>();

  const handlerChatClick = (chatId: string): void => {
    setCurrentChatId(chatId);
  };

  const chatViews = chatStore.chats.map((chat) => (
    <ChatItem onClick={(): void => handlerChatClick(chat.chatID)}>
      {chat.senderInfo.lastName}
    </ChatItem>
  ));

  const currentChat = chatStore.chats.find(
    (chat) => chat.chatID === currentChatId,
  );
  const messagesViews = currentChat
    ? currentChat?.messageList.map((message) => (
        <MessageItem
          className={chatStore.myID === message.senderID ? 'my' : ''}
        >
          <MessageView>{message.text}</MessageView>
        </MessageItem>
      ))
    : [];
  const handlerButtonClick = (): void => {
    if (currentChatId) {
      chatStore.addMessage(
        currentChatId,
        'Kuku',
        '775c614f-6ea7-40e5-913c-0b5213822229',
      );
    }
  };

  const responseGoogle = async (res: GoogleLoginResponse): Promise<void> => {
    const result = await axios.post(
      'http://localhost:3001/auth/google',
      {
        accessToken: res.accessToken,
        tokenId: res.tokenId,
        fingerprint: await getFingerprint(),
      },
      { withCredentials: true },
    );
    console.log(result);
  };

  return (
    <ChatBlockView>
      <GoogleLogin
        clientId="816087707667-a8lht42hlk4qja2tfrlfiequj1phm68m.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={(res): Promise<void> =>
          responseGoogle(res as GoogleLoginResponse)
        }
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      <ChatList>{chatViews}</ChatList>
      <MessageList>{messagesViews}</MessageList>
      <form>
        <input
          type="text"
          className="inputMessage"
          placeholder="type your message"
        />
        <button
          onClick={(ev): void => {
            ev.preventDefault();
            handlerButtonClick();
          }}
        ></button>
      </form>
    </ChatBlockView>
  );
};

export default observer(ChatBlock);
