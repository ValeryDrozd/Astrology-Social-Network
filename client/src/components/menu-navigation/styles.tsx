import styled from 'styled-components';

export const NavigationBarBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ListItem = styled.li`
  background: #570e88;
  margin: 0.5rem;
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  list-style-type: none;
  transition: background 0.1s ease;
  &:hover {
    cursor: pointer;
    background: #6d3294;
  }
`;
