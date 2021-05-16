import styled from 'styled-components';

export const ExtraInfoDiv = styled.div`
  margin: 0 auto;
  padding: 1rem 5rem;
  display: flex;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  width: 100%;
  margin: 0 auto;
`;

export const InfoPart = styled.div`
  margin: 0 2rem;
  display: flex;
  flex-direction: column;

  &.row {
    flex-direction: row;
    margin-top: 0.5rem;
  }
`;

export const ExtraForm = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0;
  width: 100%;
`;

export const ZodiacSelect = styled.select`
  font-size: 25px;
  max-width: 30rem;
  min-width: 10rem;
  margin: 0.5rem;
`;

export const StyledDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  font-size: 25px;
`;

export const TitleName = styled.h3`
  text-align: center;
  width: 100%;
  margin: 0.75rem auto;
`;

export const SelectSexName = styled.label`
  text-align: center;
  font-size: 20px;
  margin: 0.75rem 0.5rem 0.25rem 0.5rem;
  width: 100%;
`;

export const Input = styled.input`
  margin: 0 auto;
  display: block;
`;

export const InfoDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
`;

export const AboutInput = styled.input`
  border: #bf99d8 1px solid;
  font-size: medium;
  padding: 0.5rem;
  margin: 0.25rem 0;
  flex-grow: 1;
  max-width: 50rem;
`;
