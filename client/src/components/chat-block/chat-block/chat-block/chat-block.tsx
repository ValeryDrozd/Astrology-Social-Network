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

const ChatBlock = (): JSX.Element => {
  const [currentChatId, setCurrentChatId] = useState<string>();

  const handlerChatClick = (chatId: string): void => {
    setCurrentChatId(chatId);
  };

  const chatViews = chatStore.chats.map((chat) => (
    <ChatItem onClick={(): void => handlerChatClick(chat.chatId)}>
      {chat.senderInfo.nameUser}
    </ChatItem>
  ));

  const currentChat = chatStore.chats.find(
    (chat) => chat.chatId == currentChatId,
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
    // chatStore.addMessage()
  };

  return (
    <ChatBlockView>
      <ChatList>{chatViews}</ChatList>
      <MessageList>{messagesViews}</MessageList>
      <form>
        <input
          type="text"
          className="inputMessage"
          placeholder="type your message"
        />
        <button onClick={handlerButtonClick}></button>
      </form>
    </ChatBlockView>
  );
};

export default observer(ChatBlock);
