import ProfileBlock from '../../components/profile-block/profile-block';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import chatStore from '../../stores/store';
import { useHistory } from 'react-router';
function ProfilePage(): JSX.Element {
  const history = useHistory();
  useEffect(() => {
    const { user } = chatStore;
    if (chatStore.initialized) {
      if (!user) {
        return history.push('/login');
      }

      if (user.sex === null || !user.birthDate || !user.zodiacSign) {
        history.push('/extra-page');
      }
    }
  }, [chatStore.user, chatStore.initialized]);
  return (
    <div>
      <ProfileBlock />
    </div>
  );
}

export default observer(ProfilePage);
