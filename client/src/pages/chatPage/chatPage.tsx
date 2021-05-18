import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react';
import Message from 'interfaces/message';
import chatStore from 'stores/store';
import ScrollList from 'components/scroll-list/scroll-list';
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
  MessageStatus,
  SendBlock,
} from './styles';
import Chat from 'interfaces/chat';

export default observer(function ChatPage(): JSX.Element {
  const history = useHistory();
  useEffect(() => {
    if (
      chatStore.initialized &&
      (chatStore.user?.sex === null ||
        !chatStore.user?.zodiacSign ||
        !chatStore.user?.birthDate)
    ) {
      history.push('/extra-page');
    }
    if (chatStore?.initialized && !chatStore?.user) {
      history.push('/login');
    }
  }, [history, chatStore?.user, chatStore.initialized]);

  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [newMessageText, setNewMessageText] = useState<string>('');

  const handlerChatClick = (chatId: string): void => {
    setCurrentChatId(chatId);
  };

  const currentChat = chatStore.chats.find(
    (chat) => chat.chatID === currentChatId,
  );

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (newMessageText) {
      chatStore.addMessage(currentChatId, newMessageText);
      setNewMessageText('');
    }
  };

  const chatsList = chatStore.chats
    .slice()
    .sort((chat1, chat2) =>
      chat1.messageList.length === 0
        ? 1
        : chat2.messageList.length === 0
        ? -1
        : chat2.messageList[chat2.messageList.length - 1]?.time.getTime() -
          chat1.messageList[chat1.messageList.length - 1]?.time.getTime(),
    );

  const messagesList = currentChat ? currentChat.messageList : [];

  const renderMessage = (message: Message): JSX.Element => (
    <MessageItem
      key={`message-${currentChatId}-${message.messageID}`}
      className={chatStore.myID === message.senderID ? 'my' : ''}
    >
      <SendBlock className={chatStore.myID === message.senderID ? 'my' : ''}>
        <MessageStatus className={message.isSent ? 'isSent' : ''} />
        <MessageView>{message.text}</MessageView>
      </SendBlock>
    </MessageItem>
  );

  const renderChatItem = (chat: Chat): JSX.Element => (
    <ChatItem
      className={currentChatId === chat.chatID ? `selected` : ''}
      key={`chat-${chat.chatID}`}
      onClick={(): void => handlerChatClick(chat.chatID)}
    >
      <ChatName>
        {chat.senderInfo.lastName + ' ' + chat.senderInfo.firstName}
      </ChatName>
      <ChatLastMessage>
        {chat.messageList[chat.messageList.length - 1]?.text}
      </ChatLastMessage>
    </ChatItem>
  );

  const wrapMessagesList = (
    list: JSX.Element[],
    onWheel: (i: React.WheelEvent<HTMLUListElement>) => void,
  ): JSX.Element => (
    <MessagesArea>
      <MessageList onWheel={onWheel}>{list}</MessageList>
    </MessagesArea>
  );

  const wrapChatList = (
    list: JSX.Element[],
    onWheel: (e: React.WheelEvent<HTMLUListElement>) => void,
  ): JSX.Element => <ChatList onWheel={onWheel}>{list}</ChatList>;

  return (
    <ChatBlockView>
      <ScrollList
        startBottom={false}
        list={chatsList}
        numberOfVisibleItems={7}
        wrap={wrapChatList}
        renderItem={(chat): JSX.Element => renderChatItem(chat as Chat)}
      />
      <MessagesBlock>
        <ScrollList
          startBottom
          numberOfVisibleItems={9}
          wrap={wrapMessagesList}
          renderItem={(message): JSX.Element =>
            renderMessage(message as Message)
          }
          list={messagesList}
        />
        {currentChatId ? (
          <InputArea>
            <ChatForm onSubmit={(ev): void => handleSubmit(ev)}>
              <Input
                type="text"
                placeholder="type your message"
                value={newMessageText}
                onChange={({ target }): void => setNewMessageText(target.value)}
              />
              <Button>Send</Button>
            </ChatForm>
          </InputArea>
        ) : null}
      </MessagesBlock>
    </ChatBlockView>
  );
});
