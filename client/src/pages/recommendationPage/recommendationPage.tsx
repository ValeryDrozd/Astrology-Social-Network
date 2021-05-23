import ScrollList from 'components/scroll-list/scroll-list';
import { StyledButton } from 'components/styled/styled-button';
import { UserWithCompatibility } from 'interfaces/user';
import { observer } from 'mobx-react';
import { boolean } from 'mobx-state-tree/dist/internal';
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
} from './styles';

export default observer(function RecommendationPage(): JSX.Element {
  const history = useHistory();
  const [mode, setMode] = useState('Any');

  const [recommendations, setRecommendations] = useState<
    UserWithCompatibility[]
  >([]);

  const setRecs = async (): Promise<void> => {
    let check = undefined;
    if (mode === 'Male' || mode === 'Female') {
      check = mode === 'Male';
    }

    getRecommendation(chatStore.accessToken, check).then((users) => {
      setRecommendations(users);
    });
  };

  useEffect((): void => {
    if (chatStore.initialized) {
      if (!chatStore.accessToken) {
        return history.push('/');
      }
      setRecs();
    }
  }, [chatStore.initialized, mode]);

  const renderRecommendation = (user: UserWithCompatibility): JSX.Element => (
    <UsersListItem
      key={`rec-${user.userID}`}
      onClick={(): void => history.push(`/users/${user.userID}`)}
    >
      <UserName>{`${user.lastName} ${user.firstName}`}</UserName>
      <UserInfoBlock>
        <UserSpan>Zodiac Sign: {user.zodiacSign}</UserSpan>
        <UserSpan>Sex: {user.sex ? 'Male' : 'Female'}</UserSpan>
        <UserSpan>Birth date: {user.birthDate?.toLocaleDateString()}</UserSpan>
        <UserSpan>Compatibility: {user.compatibility}</UserSpan>
      </UserInfoBlock>
    </UsersListItem>
  );

  const wrapRecommendations = (
    list: JSX.Element[],
    onWheel: (i: React.WheelEvent<HTMLUListElement>) => void,
  ): JSX.Element => <UsersList onWheel={onWheel}>{list}</UsersList>;

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
      <ScrollList
        list={recommendations}
        renderItem={(user): JSX.Element =>
          renderRecommendation(user as UserWithCompatibility)
        }
        numberOfVisibleItems={3}
        wrap={wrapRecommendations}
      />
    </RecommendationDiv>
  );
});
