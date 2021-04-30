import { observer } from 'mobx-react';
import {
  Title,
  AvatarImage,
  ProfileBlockView,
  DetailInfo,
  InfoBlock,
  ProfileDetails,
  ButtonBlock,
} from './styles';
import chatStore from 'stores/store';
import { useParams } from 'react-router';
import { getUserProfile } from 'services/users.service';
import { useEffect, useState } from 'react';
import User from 'interfaces/user';
import { useHistory } from 'react-router-dom';
import Modal from 'components/modal/modal';
import { StyledButton } from 'components/styled/styled-button';

export default observer(function ProfileBlock(): JSX.Element {
  const [user, setUser] = useState<User>();
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const params = useParams() as { id: string };
  const { id } = params;

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
  }, [chatStore?.user, chatStore.initialized, history]);

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
  }, [chatStore.initialized, params]);

  if (!user) return <div></div>;

  const modal = showModal ? (
    <Modal onClose={(): void => setShowModal(false)}>
      <input></input>
      <input></input>
      <input></input>
    </Modal>
  ) : null;

  return (
    <ProfileBlockView>
      {modal}
      <Title>Profile</Title>
      <InfoBlock>
        <AvatarImage className={user?.sex ? '' : 'womanImg'} />
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
      <ButtonBlock>
        {user?.userID === chatStore?.myID ? (
          <StyledButton onClick={(): void => setShowModal(true)}>
            Change profile
          </StyledButton>
        ) : null}
      </ButtonBlock>
    </ProfileBlockView>
  );
});
