import { observer } from 'mobx-react';
import { Title, AvatarImage, ProfileBlockView, Name } from './styles';
import chatStore from '../../stores/store';

export default observer(function ProfileBlock(): JSX.Element {
  const user = chatStore.user;

  console.log(user?.sex);
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
