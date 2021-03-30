import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { StyledButton } from '../../components/styled/styled-button';
import getFingerprint from '../../helpers/get-fingerprint';
import { login } from '../../services/auth.service';
import chatStore from '../../stores/store';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { ErrorValidation } from '../../components/styled/error-validation';
import { ButtonBox, LoginDiv, LoginForm, LoginInput, Title } from './styles';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCorrectLogin, setCorrectLogin] = useState<boolean>(true);
  const [isCorrectPassword, setCorrectPassword] = useState<boolean>(true);

  const history = useHistory();

  const responseGoogle = async (res: GoogleLoginResponse): Promise<void> => {
    const result = await axios.post(
      'http://localhost:3001/auth/google',
      {
        accessToken: res.accessToken,
        tokenId: res.tokenId,
        fingerprint: await getFingerprint(),
      },
      { withCredentials: true },
    );
    console.log(result);
  };

  const setToken = async (): Promise<void> => {
    try {
      const { accessToken } = await login(email, password);
      chatStore.setAccessToken(accessToken);
    } catch (error) {}
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    await setToken();
  };

  const handleSignIn = async (): Promise<void> => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase()) && password.length >= 8) {
      await setToken();
      history.push('/chat');
    }
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
        <ErrorValidation> </ErrorValidation>
        <label htmlFor="password">Password</label>
        <LoginInput
          type="password"
          id="password"
          value={password}
          onChange={(ev): void => setPassword(ev.target.value)}
        />
        <div></div>
        <ButtonBox>
          <StyledButton onClick={(): Promise<void> => handleSignIn()}>
            Sign in
          </StyledButton>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
            buttonText="Login"
            onSuccess={
              (res): Promise<void> => responseGoogle(res as GoogleLoginResponse)
              // history.push('/chat')
            }
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </ButtonBox>
      </LoginForm>
      <StyledButton onClick={(): void => history.push('/registration')}>
        Sign up
      </StyledButton>
    </LoginDiv>
  );
}
