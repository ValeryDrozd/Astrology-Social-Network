import User, { UserWithCompability } from 'interfaces/user';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getRecommendation } from 'services/users.service';
import chatStore from 'stores/store';
import {
  RecommendationDiv,
  Title,
  UserInfoBlock,
  UserName,
  UsersList,
  UsersListItem,
  UserSpan,
} from './styles';

export default observer(function RecommendationPage(): JSX.Element {
  const history = useHistory();

  const [recommendations, setRecommendations] = useState<
    UserWithCompability[]
  >();

  useEffect((): void => {
    if (chatStore.initialized) {
      if (!chatStore.accessToken) {
        return history.push('/');
      }
      getRecommendation(chatStore.accessToken).then((users) => {
        setRecommendations(users);
      });
    }
  }, [chatStore.initialized]);

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
      <UsersList>{userViews}</UsersList>
    </RecommendationDiv>
  );
});
