import ProfileBlock from '../../components/profile-block/profile-block';
import { observer } from 'mobx-react';

function ProfilePage(): JSX.Element {
  return (
    <div>
      <ProfileBlock />
    </div>
  );
}

export default observer(ProfilePage);
