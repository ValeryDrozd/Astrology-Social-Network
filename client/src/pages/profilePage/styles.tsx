import styled from 'styled-components';

export const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin: 1rem;
`;

export const AvatarImage = styled.img`
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  width: 100%;
  height: 100%;
  background-image: url('/man.jpg');
  background-size: contain;
  &.womanImg {
    background-image: url('/women.jpg');
  }
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

export const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;
