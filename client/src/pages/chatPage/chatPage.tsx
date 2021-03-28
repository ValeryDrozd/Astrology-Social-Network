import { observer } from 'mobx-react';
import React, { FormEvent, useState } from 'react';
import chatStore from '../../stores/store';
import Message from '../../interfaces/message';
import { throws } from 'node:assert';
import { myMessages, otherMessages } from './styles';
import Chat from '../../interfaces/chat';
import ChatBlock from '../../components/chat-block/chat-block/chat-block/chat-block';

class ChatPage extends React.Component {
  private message = ''; //useState('');
  private chatIndex = 0;
  private chats = chatStore;

  // private ChatList = this.chats.chats.map((chats: Chat) => (
  //   <button  onLabelClick={this.chatIndex = this.chats.chats.indexOf(chats)}>{chats.chatId}</button>
  // ));

  // state = {
  //   ChatStore: [
  //     chat1: [],
  //   ]
  // };

  render(): JSX.Element {
    // const { chats } = chatStore;

    // const messageViews = this.chats.chats?.length
    //   ? chats[this.chatIndex].messageList.map((m: Message, index: number) => (
    //       <div key={index}>{m.text}</div>

    //       //   (m.senderId===1)?:<otherMessages key={index}>{m.text}</otherMessages>;
    //     ))
    //   : [];

    // const handleMessage = (letter: string): void => {
    //   this.message = letter;
    //   //console.log(letter);
    //   //this.message = [...newMessage];
    // };

    // const handleSubmit = (ev: FormEvent<HTMLFormElement>): void => {
    //   ev.preventDefault();
    //   //console.log(this.message);
    //   chatStore.addMessage(1, this.message, new Date(), 1);
    //   this.message = '';
    //   //document.getElementById('messageText').value = '';
    // };

    return (
      <div>
        <ChatBlock />
      </div>
    );
  }
}

export default observer(ChatPage);
