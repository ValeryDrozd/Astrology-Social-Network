import { observer } from 'mobx-react';
import React, { useState } from 'react';
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
} from './styles';

const ChatBlock = (): JSX.Element => {
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [newMessageText, setNewMessageText] = useState<string>('');
  const handlerChatClick = (chatId: string): void => {
    setCurrentChatId(chatId);
  };

  const chatViews = chatStore.chats.map((chat) => (
    <ChatItem onClick={(): void => handlerChatClick(chat.chatId)}>
      {chat.senderInfo.nameUser}
    </ChatItem>
  ));

  const currentChat = chatStore.chats.find(
    (chat) => chat.chatId === currentChatId,
  );
  const messagesViews = currentChat
    ? currentChat?.messageList.map((message) => (
        <MessageItem
          className={chatStore.myID === message.senderId ? 'my' : ''}
        >
          <MessageView>{message.text}</MessageView>
        </MessageItem>
      ))
    : [];

  const handlerButtonClick = (): void => {
    chatStore.addMessage('1', newMessageText, 1);
    setNewMessageText('');
  };

  return (
    <ChatBlockView>
      <ChatList>{chatViews}</ChatList>
      <MessagesBlock>
        <MessageList>{messagesViews}</MessageList>
        {currentChatId ? (
          <div>
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
          </div>
        ) : null}
      </MessagesBlock>
    </ChatBlockView>
  );
};

export default observer(ChatBlock);
