import styled from 'styled-components';

export const ChatBlockView = styled.div`
  display: flex;
  margin: 0 1rem;
  padding-top: 1rem;
  height: 95vh;
  position: relative;
  flex-grow: 1;
  z-index: 1;
`;

export const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  border: #fff 1px solid;
  width: 35vw;
  max-width: 20rem;
`;

export const ChatItem = styled.div`
  border: #fff 1px solid;
  padding: 0.75rem;
  margin: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #5f3292;
  }
`;

export const ChatName = styled.h4`
  margin: 0;
  font-size: x-large;
`;

export const ChatLastMessage = styled.span`
  font-size: x-small;
`;

export const MessagesArea = styled.div`
  overflow-y: hidden;
  z-index: 10;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  border: #fff 1px solid;
  overflow-x: hidden;
  height: 90vh;
`;

export const MessageList = styled.ul`
  position: absolute;
  width: 100%;
  left: 0;
  padding: 0;
  margin: auto;
  overflow-y: hidden;
  z-index: -1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  height: 100%;
`;

export const MessageItem = styled.div`
  padding: 0.75rem;
  overflow-y: hidden;
  margin: 0.25rem;
  display: flex;
  max-width: 60vw;

  &.my {
    margin-left: auto;
  }
`;

export const MessageView = styled.div`
  border: #bf99d8 1px solid;
  border-radius: 0.25rem;
  display: block;
  padding: 0.5rem;
`;

export const InputArea = styled.div`
  display: flex;
`;

export const Button = styled.button`
  cursor: pointer;
  display: flex;
  flex-grow: 2;
  align-items: center;
  flex-direction: column;
  margin: auto;
  font-size: 20px;
  padding: 1px 2px;
  color: white;
  border: 1px solid white;
  background-color: #282c34;
`;

export const Input = styled.input`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 90%;
  font-size: 20px;
  border: 1px solid white;
  color: white;
  background-color: #282c34;
`;

export const MessagesBlock = styled.div`
  display: flex;
  flex-grow: 3;
  flex-direction: column;
`;

export const ChatForm = styled.form`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  padding: 0;
  width: 100%;
`;
