import { observer } from 'mobx-react';
import {
  Title,
  AvatarImage,
  ProfileBlockView,
  DetailInfo,
  InfoBlock,
  ProfileDetails,
  ButtonBlock,
  EditInput,
  SelectSex,
  SelectZodiac,
  Label,
} from './styles';
import chatStore from 'stores/store';
import { useParams } from 'react-router';
import {
  changeMyPassword,
  createNewChat,
  getUserProfile,
  patchMyProfile,
} from 'services/users.service';
import { useEffect, useState } from 'react';
import User from 'interfaces/user';
import { useHistory } from 'react-router-dom';
import Modal from 'components/modal/modal';
import { StyledButton } from 'components/styled/styled-button';
import Calendar from 'react-calendar';
import zodiacSigns from 'interfaces/zodiac-signs';

export default observer(function ProfilePage(): JSX.Element {
  const [user, setUser] = useState<User>();
  const [newUserInfo, setNewUserInfo] = useState<User>();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const history = useHistory();
  const params = useParams() as { id: string };
  const { id } = params;

  const getProfile = async (): Promise<void> => {
    try {
      const profileUser = await getUserProfile(chatStore.accessToken, id);
      setUser(profileUser);
      setNewUserInfo(profileUser);
    } catch {
      history.push('/');
    }
  };

  useEffect(() => {
    if (chatStore.initialized) {
      if (!chatStore.user) {
        return history.push('/login');
      }

      if (
        chatStore.user.sex === null ||
        !chatStore.user.birthDate ||
        !chatStore.user.zodiacSign
      ) {
        return history.push('/extra-page');
      }
    }
  }, [chatStore.initialized]);

  useEffect(() => {
    if (chatStore.initialized) {
      getProfile();
    }
  }, [chatStore.initialized, params]);

  if (!user) return <div></div>;

  const changeProfile = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!newUserInfo?.firstName || !newUserInfo?.lastName)
      return alert('Type your name');
    await patchMyProfile(chatStore.accessToken, { ...newUserInfo });
    chatStore.setUser(newUserInfo as User);
    setUser(newUserInfo);
    setShowModal(false);
  };

  const changePassword = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (newPassword !== repeatNewPassword) {
      return alert('Please repeat correctly password');
    }
    const { accessToken } = await changeMyPassword(
      chatStore.accessToken,
      oldPassword,
      newPassword,
    );
    chatStore.setAccessToken(accessToken);
  };

  const options = zodiacSigns.map((name) => (
    <option key={name} value={name}>
      {name}
    </option>
  ));

  const modal = showModal ? (
    <Modal onClose={(): void => setShowModal(false)}>
      <Label>Enter your First name</Label>
      <EditInput
        value={newUserInfo?.firstName}
        onChange={({ target }): void =>
          setNewUserInfo((newUserInfo) => ({
            ...(newUserInfo as User),
            firstName: target.value,
          }))
        }
        type="text"
      />
      <Label>Enter your Last name</Label>
      <EditInput
        value={newUserInfo?.lastName}
        onChange={({ target }): void =>
          setNewUserInfo((newUserInfo) => ({
            ...(newUserInfo as User),
            lastName: target.value,
          }))
        }
        type="text"
      />
      <Label>Enter your Birth date</Label>
      <Calendar
        value={newUserInfo?.birthDate}
        onChange={(date): void =>
          setNewUserInfo((newUserInfo) => ({
            ...(newUserInfo as User),
            birthDate: date as Date,
          }))
        }
      />
      <Label>Enter your Sex</Label>
      <SelectSex>
        <input
          onChange={(): void =>
            setNewUserInfo((newUserInfo) => ({
              ...(newUserInfo as User),
              sex: true,
            }))
          }
          type="radio"
          checked={newUserInfo?.sex}
          value="Male"
          name="sex"
        />
        Male
      </SelectSex>
      <SelectSex>
        <input
          onChange={(): void =>
            setNewUserInfo((newUserInfo) => ({
              ...(newUserInfo as User),
              sex: false,
            }))
          }
          type="radio"
          checked={!newUserInfo?.sex}
          value="Female"
          name="sex"
        />
        Female
      </SelectSex>
      <Label>Enter your Zodiac sign</Label>
      <SelectZodiac
        value={newUserInfo?.zodiacSign}
        onChange={({ target }): void =>
          setNewUserInfo((newUserInfo) => ({
            ...(newUserInfo as User),
            zodiacSign: target.value,
          }))
        }
      >
        {options}
      </SelectZodiac>
      <StyledButton onClick={changeProfile}>Save changes</StyledButton>
    </Modal>
  ) : null;

  const changePasswordModal = showChangePasswordModal ? (
    <Modal onClose={(): void => setShowChangePasswordModal(false)}>
      <Label>Confirm your password</Label>
      <EditInput
        value={oldPassword}
        onChange={({ target }): void => setOldPassword(target.value)}
        type="password"
      />

      <Label>Enter new password</Label>
      <EditInput
        value={newPassword}
        onChange={({ target }): void => setNewPassword(target.value)}
        type="password"
      />

      <Label>Repeat new password</Label>
      <EditInput
        value={repeatNewPassword}
        onChange={({ target }): void => setRepeatNewPassword(target.value)}
        type="password"
      />
    </Modal>
  ) : null;

  const makeNewChat = async (): Promise<void> => {
    const oldChat = chatStore.chats.find(
      (c) => c.senderInfo.senderID === user.userID,
    );
    if (!oldChat) {
      const chat = await createNewChat(chatStore.accessToken, user.userID);
      chatStore.addNewChat(chat);
    }
    history.push('/chat');
  };

  return (
    <ProfileBlockView>
      {modal}
      {changePasswordModal}
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
          <>
            <StyledButton
              onClick={(): void => {
                setShowModal(true);
              }}
            >
              Change profile
            </StyledButton>
            <StyledButton
              onClick={(): void => setShowChangePasswordModal(true)}
            >
              Change password
            </StyledButton>
          </>
        ) : (
          <StyledButton onClick={makeNewChat}>Write a message</StyledButton>
        )}
      </ButtonBlock>
    </ProfileBlockView>
  );
});
