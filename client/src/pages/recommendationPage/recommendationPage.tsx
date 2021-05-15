import { StyledButton } from 'components/styled/styled-button';
import { UserWithCompability } from 'interfaces/user';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getRecommendation } from 'services/users.service';
import chatStore from 'stores/store';
import {
  Input,
  RecommendationBlock,
  RecommendationDiv,
  SelectSexName,
  Title,
  UserInfoBlock,
  UserName,
  UsersList,
  UsersListItem,
  UserSpan,
  SelectDiv,
} from './styles';

export default observer(function RecommendationPage(): JSX.Element {
  const history = useHistory();
  const [mode, setMode] = useState('Any');

  const [recommendations, setRecommendations] = useState<
    UserWithCompability[]
  >();

  const setRecs = (): Promise<void> =>
    getRecommendation(
      chatStore.accessToken,
      mode === 'Male' ? true : mode === 'Female' ? false : undefined,
    ).then((users) => {
      setRecommendations(users);
    });

  useEffect((): void => {
    if (chatStore.initialized) {
      if (!chatStore.accessToken) {
        return history.push('/');
      }
      setRecs();
    }
  }, [chatStore.initialized, mode]);

  const userViews = recommendations?.map((user) => (
    <UsersListItem
      key={`rec-${user.userID}`}
      onClick={(): void => history.push(`/users/${user.userID}`)}
    >
      <UserName>{`${user.lastName} ${user.firstName}`}</UserName>
      <UserInfoBlock>
        <UserSpan>Zodiac Sign: {user.zodiacSign}</UserSpan>
        <UserSpan>Sex: {user.sex ? 'Male' : 'Female'}</UserSpan>
        <UserSpan>Birth date: {user.birthDate?.toLocaleDateString()}</UserSpan>
        <UserSpan>Compatibility: {user.compability}</UserSpan>
      </UserInfoBlock>
    </UsersListItem>
  ));

  return (
    <RecommendationDiv>
      <Title>Recommendations</Title>
      <RecommendationBlock>
        <SelectSexName>
          <Input
            onChange={(): void => setMode('Male')}
            type="radio"
            checked={mode === 'Male'}
            value="Male"
            name="sex"
          />
          Male
        </SelectSexName>
        <SelectSexName>
          <Input
            onChange={(): void => setMode('Female')}
            type="radio"
            checked={mode === 'Female'}
            value="Female"
            name="sex"
          />
          Female
        </SelectSexName>
        <SelectSexName>
          <Input
            onChange={(): void => setMode('Any')}
            type="radio"
            checked={mode === 'Any'}
            value="Female"
            name="sex"
          />
          Any
        </SelectSexName>
        <StyledButton onClick={setRecs}>Refresh</StyledButton>
      </RecommendationBlock>
      <UsersList>{userViews}</UsersList>
    </RecommendationDiv>
  );
});
