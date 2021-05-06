import styled from 'styled-components';

export const RecommendationDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: calc(3vw + 1rem);
  margin: 1rem;
`;

export const UsersList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  overflow-y: auto;
`;

export const UsersListItem = styled.li`
  list-style-type: none;
  background: #570e88;
  display: flex;
  margin: 0.5rem;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;

  transition: background 0.1s ease;
  &:hover {
    cursor: pointer;
    background: #6d3294;
  }
`;

export const UserName = styled.h4`
  font-size: large;
  margin: 0.5rem;
`;

export const UserSpan = styled.span`
  font-size: medium;
  text-align: right;
`;

export const UserInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin: 0 0.5rem 0 auto;

  & * {
    margin: 0.25rem;
  }
`;
