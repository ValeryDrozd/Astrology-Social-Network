import axios from 'axios';
import { observer } from 'mobx-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import getFingerprint from '../../helpers/get-fingerprint';
import chatStore from '../../stores/store';
import {
  ChatForm,
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
  ChatLastMessage,
  ChatName,
} from './styles';

const ChatBlock = (): JSX.Element => {
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [flag, setFlag] = useState(false);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect((): void => {
    if (flag) {
      ref.current?.scrollIntoView();
      setFlag(false);
    }
  }, [flag]);

  const handlerChatClick = (chatId: string): void => {
    setCurrentChatId(chatId);
    setFlag(true);
  };

  const currentChat = chatStore.chats.find(
    (chat) => chat.chatID === currentChatId,
  );

  const messagesViews = currentChat
    ? currentChat?.messageList.map((message, index) => (
        <MessageItem
          ref={index === currentChat?.messageList.length - 1 ? ref : null}
          key={`message-${currentChatId}-${index + 1}`}
          className={chatStore.myID === message.senderID ? 'my' : ''}
        >
          <MessageView>{message.text}</MessageView>
        </MessageItem>
      ))
    : [];

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (newMessageText !== undefined && newMessageText !== '') {
      chatStore.addMessage(currentChatId, newMessageText);
      setNewMessageText('');
      setFlag(true);
    }
  };

  const chatViews = chatStore.chats.map((chat, index) => (
    <ChatItem
      key={`chat-${index + 1}`}
      onClick={(): void => handlerChatClick(chat.chatID)}
    >
      <ChatName>
        {chat.senderInfo.lastName + ' ' + chat.senderInfo.firstName}
      </ChatName>
      <ChatLastMessage>
        {chat.messageList[chat.messageList.length - 1].text.slice(0, 30) +
          '...'}
      </ChatLastMessage>
    </ChatItem>
  ));

  return (
    <ChatBlockView>
      <ChatList>{chatViews}</ChatList>
      <MessagesBlock>
        <MessageList ref={ref}>
          {messagesViews}
          <div ref={ref} />
        </MessageList>
        {currentChatId ? (
          <InputArea>
            <ChatForm onSubmit={(ev): void => handleSubmit(ev)}>
              <Input
                type="text"
                placeholder="type your message"
                value={newMessageText}
                onChange={({ target }): void => setNewMessageText(target.value)}
              />
              <Button className="button">Send</Button>
            </ChatForm>
          </InputArea>
        ) : null}
      </MessagesBlock>
    </ChatBlockView>
  );
};

export default observer(ChatBlock);
