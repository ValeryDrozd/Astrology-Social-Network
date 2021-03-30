import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { StyledButton } from '../../components/styled/styled-button';
import getFingerprint from '../../helpers/get-fingerprint';
import { login } from '../../services/auth.service';
import { LoginForm, LoginDiv, ButtonBox, LoginInput, Title } from './styles';
import chatStore from '../../stores/store';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const history = useHistory();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const { accessToken } = await login(email, password);
    chatStore.setAccessToken(accessToken);
  };

  return (
    <LoginDiv>
      <Title>Login</Title>
      <LoginForm onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <LoginInput
          type="email"
          id="email"
          value={email}
          onChange={(ev): void => setEmail(ev.target.value)}
        />
        <label htmlFor="password">Password</label>
        <LoginInput
          type="password"
          id="password"
          value={password}
          onChange={(ev): void => setPassword(ev.target.value)}
        />
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
