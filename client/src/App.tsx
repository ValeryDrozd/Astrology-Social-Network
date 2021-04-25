import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import ProfilePage from './pages/profilePage/profilePage';
import RegistrationPage from './pages/registrationPage/registrationPage';
import styled from 'styled-components';
import ChatPage from './pages/chatPage/chatPage';
import ExtraInfoPage from './pages/extraInfoPage/extraInfoPage';
import { logout } from './services/auth.service';
import chatStore, { ChatStore, reloadChatStore } from './stores/store';
import { observer } from 'mobx-react';

export default observer(function App(): JSX.Element {
  const history = useHistory();
  return (
    <AppView>
      <Router>
        <Switch>
          <Route path="/" exact component={LoginPage}></Route>
          <Route path="/chat" component={ChatPage}></Route>
          <Route path="/registration" component={RegistrationPage}></Route>
          <Route path="/extra-page" component={ExtraInfoPage}></Route>
          <Route path="/users/:id" component={ProfilePage} />
          <Redirect to="/" />
        </Switch>
      </Router>
      {chatStore?.user ? (
        <button
          onClick={async (): Promise<void> => {
            await logout();
            reloadChatStore();
            console.log('kukusiki');
            window.location.reload();
          }}
        >
          Logout
        </button>
      ) : null}
    </AppView>
  );
});

const AppView = styled.div`
  background: #282c34;
  min-width: none;
  height: 100vh;
  color: #fff;
  overflow: hidden;
`;
