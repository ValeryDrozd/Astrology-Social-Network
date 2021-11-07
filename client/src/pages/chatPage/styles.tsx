import styled from 'styled-components';

export const myMessages = styled.div`
  width: 100%;
  text-align: right;
`;

export const otherMessages = styled.div`
  width: 100%;
  text-align: left;
`;

export const ChatBlockView = styled.div`
  display: flex;
  margin: 0 1rem;
  padding-top: 1rem;
  height: 95vh;
  position: relative;
  flex-grow: 1;
  z-index: 1;

  @media (max-width: 50rem) {
    max-height: 85vh;
  }
`;

export const ChatList = styled.ul`
  display: flex;
  flex-direction: column;
  border: #fff 1px solid;
  overflow: hidden;
  width: 15rem;
  margin: 0;
  padding: 0;
`;

export const ChatItem = styled.li`
  border: #fff 1px solid;
  /* flex-grow: 1; */
  padding: 0.75rem;
  margin: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 4.5 rem;
  @media (max-width: 50rem) {
    min-height: 3.75rem;
    * button {
      padding: 0.25rem !important;
    }
  }
  }

  &:hover {
    background-color: #5f3292;
  }

  &.selected {
    background-color: #5f3292;
  }
`;

export const ChatItemBlock = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ChatName = styled.h4`
  margin: 0.25rem 0;
  font-size: x-large;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatLastMessage = styled.span`
  font-size: x-small;
  margin: auto 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MessagesArea = styled.div`
  overflow-y: auto;
  z-index: 10;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  border: #fff 1px solid;
  overflow-y: hidden;
  overflow-x: auto;
`;

export const MessageList = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const MessageItem = styled.div`
  padding: 0.75rem;
  margin: 0.4 5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-right: auto;
  margin-left: 0;
  &.my {
    margin-right: 0;
    margin-left: auto;
  }

  @media (max-width: 50rem) {
    margin-top: 0;
    margin-bottom: 0.25rem;
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
  flex-direction: column;
  flex-grow: 3;
`;

export const ChatForm = styled.form`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  padding: 0;
  width: 100%;
`;

export const MessageStatus = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  margin: 1rem 0.35rem;
  border-radius: 50%;
  background-color: red;

  &.isSent {
    background-color: green;
  }
`;
export const SendBlock = styled.div`
  display: flex;
  &.my {
    flex-direction: row-reverse;
  }
`;
