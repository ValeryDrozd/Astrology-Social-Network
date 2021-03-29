import React from 'react';
import { useHistory } from 'react-router';
import { StyledButton } from '../../components/styled/styled-button';
import { LoginForm, LoginDiv, ButtonBox, LoginInput, Title } from './styles';

export default function LoginPage(): JSX.Element {
  const history = useHistory();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <LoginDiv>
      <Title>Login</Title>
      <LoginForm onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <LoginInput type="email" id="email" />
        <label htmlFor="password">Password</label>
        <LoginInput type="password" id="password" />
        <ButtonBox>
          <StyledButton>Sign in</StyledButton>
          {/* <OnRegistrationPageButton /> */}
          <StyledButton className="GoogleButton">
            Sign in with GOOGLE
          </StyledButton>
        </ButtonBox>
      </LoginForm>
      <StyledButton onClick={(): void => history.push('/registration')}>
        Sign up
      </StyledButton>
    </LoginDiv>
  );
}
