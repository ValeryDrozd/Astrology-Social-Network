import { observer } from 'mobx-react';
import { Title } from './styles';
import chatStore from '../../stores/store';

export default observer(function ProfileBlock(): JSX.Element {
  const user = chatStore.user;

  return (
    <div>
      <Title>Profile</Title>
      <p>{user?.firstName}</p>
    </div>
  );
});
