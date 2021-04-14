import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import Message from '../../interfaces/message';
import chatStore from '../../stores/store';
import ScrollList from '../scroll-list/scroll-list';
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
  MessagesArea,
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

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (newMessageText) {
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

  const renderMessage = (
    message: Message,
    index: number,
    array: Message[],
  ): JSX.Element => (
    <MessageItem
      key={`message-${currentChatId}-${index + 1}`}
      className={chatStore.myID === message.senderID ? 'my' : ''}
    >
      <MessageView>{message.text}</MessageView>
    </MessageItem>
  );

  const wrapMessagesList = (
    list: JSX.Element[],
    onWheel: (i: React.WheelEvent<HTMLUListElement>) => void,
  ): JSX.Element => (
    <MessagesArea>
      <MessageList onWheel={onWheel}>{list}</MessageList>
    </MessagesArea>
  );

  return (
    <ChatBlockView>
      <ChatList>{chatViews}</ChatList>
      <MessagesBlock>
        <ScrollList
          startBottom
          numberOfVisibleItems={9}
          wrap={wrapMessagesList}
          renderItem={(message, index, array): JSX.Element =>
            renderMessage(message as Message, index, array as Message[])
          }
          list={currentChat ? currentChat.messageList : []}
        ></ScrollList>
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
