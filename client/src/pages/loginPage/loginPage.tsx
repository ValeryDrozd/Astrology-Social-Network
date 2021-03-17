import {
  LoginForm,
  LoginDiv,
  ButtonBox,
  LoginInput,
  StyledButton,
  Title,
} from './styles';

export default function LoginPage(): JSX.Element {
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
          <StyledButton>Sign in with GOOGLE</StyledButton>
        </ButtonBox>
      </LoginForm>
      <StyledButton>Sign up</StyledButton>
    </LoginDiv>
  );
}
