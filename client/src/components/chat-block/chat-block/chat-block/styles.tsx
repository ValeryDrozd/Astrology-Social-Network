import styled from 'styled-components';

export const ChatBlockView = styled.div`
  display: flex;
  margin: 0 1rem;
  padding-top: 1rem;
`;

export const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  border: #fff 1px solid;
  width: 10rem;
`;

export const ChatItem = styled.div`
  border: #fff 1px solid;
  padding: 0.75rem;
  margin: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.3s ease;
  &:hover {
    background-color: #5f3292;
  }
`;

export const MessageList = styled.div`
  flex-grow: 3;
  display: flex;
  flex-direction: column;
  border: #fff 1px solid;
`;

export const MessageItem = styled.div`
  padding: 0.75rem;
  margin: 0.25rem;
  display: flex;
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
