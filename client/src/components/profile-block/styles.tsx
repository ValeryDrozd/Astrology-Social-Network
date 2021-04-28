import styled from 'styled-components';

export const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin: 1rem;
`;

export const AvatarImage = styled.img`
  //margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  height: auto;
`;

export const ProfileBlockView = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 1rem;
`;
export const InfoBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  justify-content: space-evenly;
`;

export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DetailInfo = styled.h2`
  text-align: center;
  display: flex;
`;
