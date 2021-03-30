import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { register } from '../../services/auth.service';
import { StyledButton } from '../styled/styled-button';
import {
  RegistrationDiv,
  RegistrationForm,
  RegistrationInput,
  Title,
} from './styles';

const RegistrationBlock = (): JSX.Element => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    await register(firstName, lastName, email, password);
  };

  return (
    <RegistrationDiv>
      <Title>User Registration</Title>
      <RegistrationForm onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <RegistrationInput
          value={firstName}
          onChange={(ev): void => setFirstName(ev.target.value)}
          type="text"
          id="firstName"
        />
        <label htmlFor="lastName">Last Name</label>
        <RegistrationInput
          value={lastName}
          onChange={(ev): void => setLastName(ev.target.value)}
          type="text"
          id="lastName"
        />
        <label htmlFor="email">Email</label>
        <RegistrationInput
          value={email}
          onChange={(ev): void => setEmail(ev.target.value)}
          type="email"
          id="email"
        />
        <label htmlFor="password">Password</label>
        <RegistrationInput
          value={password}
          onChange={(ev): void => setPassword(ev.target.value)}
          type="password"
          id="password"
        />
        <StyledButton className="mrg-1">Register now</StyledButton>
      </RegistrationForm>
    </RegistrationDiv>
  );
};
export default observer(RegistrationBlock);
