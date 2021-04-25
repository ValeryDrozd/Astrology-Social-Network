import { observer } from 'mobx-react';
import { Title, AvatarImage, ProfileBlockView, Name } from './styles';
import chatStore from '../../stores/store';
import { useParams } from 'react-router';
import { getUserProfile } from '../../services/users.service';
import { useEffect, useState } from 'react';
import User from '../../interfaces/user';

export default observer(function ProfileBlock(): JSX.Element {
  const [user, setUser] = useState<User>();
  const { id } = useParams() as { id: string };
  useEffect(() => {
    if (chatStore.initialized) {
      getUserProfile(chatStore.accessToken, id).then((user) => {
        setUser(user);
      });
    }
  }, [chatStore.initialized]);

  return (
    <ProfileBlockView>
      <Title>Profile</Title>
      <AvatarImage src={user?.sex ? '/man.jpg' : 'women.jpg'} />
      <Name>
        {user?.lastName} {user?.firstName}
      </Name>
    </ProfileBlockView>
  );
});
