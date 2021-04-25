import { observer } from 'mobx-react';
import {
  Title,
  AvatarImage,
  ProfileBlockView,
  DetailInfo,
  InfoBlock,
  ProfileDetails,
} from './styles';
import chatStore from '../../stores/store';
import { useParams } from 'react-router';
import { getUserProfile } from '../../services/users.service';
import { useEffect, useState } from 'react';
import User from '../../interfaces/user';
import { useHistory } from 'react-router-dom';

export default observer(function ProfileBlock(): JSX.Element {
  const [user, setUser] = useState<User>();
  const history = useHistory();
  const { id } = useParams() as { id: string };
  useEffect(() => {
    if (chatStore.initialized) {
      getUserProfile(chatStore.accessToken, id)
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          history.push('/');
        });
    }
  }, [chatStore.initialized]);

  return (
    <ProfileBlockView>
      <Title>Profile</Title>
      <InfoBlock>
        <AvatarImage src={user?.sex ? '/man.jpg' : '/women.jpg'} />
        <ProfileDetails>
          <DetailInfo>
            {user?.lastName} {user?.firstName}
          </DetailInfo>
          <DetailInfo>{user?.zodiacSign}</DetailInfo>
          <DetailInfo>{user?.birthDate?.toDateString()}</DetailInfo>
          <DetailInfo>{user?.email}</DetailInfo>
          <DetailInfo>{user?.sex}</DetailInfo>
        </ProfileDetails>
      </InfoBlock>
    </ProfileBlockView>
  );
});
