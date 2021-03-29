import axios from 'axios';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import getFingerprint from '../../helpers/get-fingerprint';
import chatStore from '../../stores/store';
import {
  ChatBlockView,
  ChatItem,
  ChatList,
  Button,
  Input,
  MessageItem,
  MessageList,
  MessagesBlock,
  MessageView,
  InputArea,
} from './styles';

const ChatBlock = (): JSX.Element => {
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [newMessageText, setNewMessageText] = useState<string>('');
  const handlerChatClick = (chatId: string): void => {
    setCurrentChatId(chatId);
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
    if (newMessageText !== undefined && newMessageText !== '') {
      chatStore.addMessage(
        currentChatId,
        newMessageText,
        '05b47a75-2e21-4f05-aa31-3bed5e1f43e4',
      ); //TODO remove hardcode
      setNewMessageText('');
    }
  };

  return (
    <ChatBlockView>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
        buttonText="Login"
        onSuccess={(res): Promise<void> =>
          responseGoogle(res as GoogleLoginResponse)
        }
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      <ChatList>{chatViews}</ChatList>
      <MessagesBlock>
        <MessageList>{messagesViews}</MessageList>
        {currentChatId ? (
          <InputArea>
            <Input
              type="text"
              placeholder="type your message"
              value={newMessageText}
              onChange={({ target }): void => setNewMessageText(target.value)}
            />
            <Button
              className="button"
              onClick={(): void => handlerButtonClick()}
            >
              Send
            </Button>
          </InputArea>
        ) : null}
      </MessagesBlock>
    </ChatBlockView>
  );
};

export default observer(ChatBlock);
