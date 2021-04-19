import React, { useEffect, useState } from 'react';
import {
  ExtraInfoDiv,
  ExtraForm,
  Input,
  InputDiv,
  Title,
  ZodiacSelect,
  CalendarDiv,
  StyledDiv,
  TitleName,
  SelectSexName,
} from './styles';
import chatStore from '../../stores/store';
import { useHistory } from 'react-router-dom';
import { observer, useStaticRendering } from 'mobx-react';
import { getMyProfile } from '../../services/users.service';
import User from '../../interfaces/user';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import zodiacSigns from '../../interfaces/zodiac-signs';

export default observer(function ExtraInfoPage(): JSX.Element {
  const [user, setUser] = useState<User>();
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [sex, setSex] = useState<boolean>(true);
  const [zodiacSign, setZodiacSign] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const { user } = chatStore;
    if (user) {
      try {
        if (user?.birthDate && user?.sex && user?.zodiacSign) {
          return history.push('/profile');
        }
        console.log(JSON.stringify(user));
        setUser(user);
        setBirthDate(user?.birthDate as Date);
        setSex(user?.sex as boolean);
        setZodiacSign(user?.zodiacSign as string);
      } catch (error) {
        setShowError(true);
      }
    }
  }, [chatStore?.user]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    // try {
    //   const user = await getMyProfile(chatStore.getAccessToken());
    //   history.push('/profile');
    // } catch (error) {
    //   setShowError(true);
    // }
  };

  const options = zodiacSigns.map((name) => <option>{name}</option>);
  return (
    <ExtraInfoDiv>
      <ExtraForm onSubmit={handleSubmit}>
        <Title>Enter more information</Title>
        <CalendarDiv>
          <TitleName>Enter your date of birth</TitleName>
          <Calendar
            onChange={(date): void => setBirthDate(date as Date)}
            value={birthDate}
          />
        </CalendarDiv>
        <TitleName>Switch your sex</TitleName>
        <StyledDiv>
          <div>
            <InputDiv>
              <Input
                type="radio"
                checked={sex}
                value="male"
                name="sex"
                onChange={({ target }): void => setSex(target.checked)}
              />
            </InputDiv>
            <SelectSexName> Male </SelectSexName>
          </div>
          <div>
            <InputDiv>
              <Input
                type="radio"
                checked={!sex}
                value="female"
                name="sex"
                onChange={({ target }): void => setSex(target.checked)}
              />
            </InputDiv>
            <SelectSexName> Female </SelectSexName>
          </div>
        </StyledDiv>
        <TitleName>Select your astrological sign</TitleName>
        <ZodiacSelect>{options}</ZodiacSelect>
      </ExtraForm>
    </ExtraInfoDiv>
  );
});
