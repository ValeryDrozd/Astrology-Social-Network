import { useEffect, useState } from 'react';
import {
  ExtraInfoDiv,
  ExtraForm,
  Input,
  Title,
  ZodiacSelect,
  InfoPart,
  StyledDiv,
  TitleName,
  SelectSexName,
  InfoDiv,
  ButtonBox,
  AboutInput,
} from './styles';
import chatStore from 'stores/store';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { patchMyProfile } from 'services/users.service';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import zodiacSigns from 'interfaces/zodiac-signs';
import { StyledButton } from 'components/styled/styled-button';

export default observer(function ExtraInfoPage(): JSX.Element {
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [sex, setSex] = useState<boolean>(true);
  const [zodiacSign, setZodiacSign] = useState<string>(zodiacSigns[0]);
  const [about, setAbout] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    const { user } = chatStore;
    if (user) {
      try {
        if (user.birthDate && user.sex !== null && user.zodiacSign) {
          return history.push(`/users/${user.userID}`);
        }
        setBirthDate(user.birthDate as Date);
        setSex(user.sex !== null ? (user.sex as boolean) : true);
        setZodiacSign(user.zodiacSign || zodiacSigns[0]);
      } catch (error) {}
    }
  }, [chatStore?.user]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    await patchMyProfile(chatStore.accessToken, {
      sex,
      birthDate,
      zodiacSign,
      about,
    });
    chatStore.user.birthDate = birthDate;
    chatStore.user.sex = sex;
    chatStore.user.zodiacSign = zodiacSign;
    chatStore.user.about = about;

    history.push(`/users/${chatStore?.user?.userID}`);
  };

  const options = zodiacSigns.map((name) => (
    <option key={name} value={name}>
      {name}
    </option>
  ));
  return (
    <ExtraInfoDiv>
      <ExtraForm onSubmit={handleSubmit}>
        <Title>Enter more information</Title>
        <InfoDiv>
          <InfoPart>
            <TitleName>Enter your date of birth</TitleName>
            <Calendar
              onChange={(date): void => setBirthDate(date as Date)}
              value={birthDate}
            />
          </InfoPart>
          <InfoPart>
            <InfoPart className="row">
              <TitleName>Switch your sex</TitleName>
              <StyledDiv>
                <SelectSexName>
                  <Input
                    onChange={(): void => setSex(true)}
                    type="radio"
                    checked={sex}
                    value="Male"
                    name="sex"
                  />
                  Male
                </SelectSexName>
                <SelectSexName>
                  <Input
                    onChange={(): void => setSex(false)}
                    type="radio"
                    checked={!sex}
                    value="Female"
                    name="sex"
                  />
                  Female
                </SelectSexName>
              </StyledDiv>
            </InfoPart>
            <InfoPart>
              <TitleName>Select your astrological sign</TitleName>
              <ZodiacSelect
                value={zodiacSign}
                onChange={({ target }): void => setZodiacSign(target.value)}
              >
                {options}
              </ZodiacSelect>
            </InfoPart>
          </InfoPart>
        </InfoDiv>
        <InfoDiv>
          <AboutInput
            type="text"
            placeholder="Input about yourself"
            maxLength={50}
            value={about}
            onChange={({ target }): void => setAbout(target.value)}
          ></AboutInput>
        </InfoDiv>
        <ButtonBox>
          <StyledButton className="bold">Go</StyledButton>
        </ButtonBox>
      </ExtraForm>
    </ExtraInfoDiv>
  );
});
