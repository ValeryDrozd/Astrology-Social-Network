import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import ProfilePage from './pages/profilePage/profilePage';
import RegistrationPage from './pages/registrationPage/registrationPage';
import styled from 'styled-components';
import ChatPage from './pages/chatPage/chatPage';
import ExtraInfoPage from './pages/extraInfoPage/extraInfoPage';

function App(): JSX.Element {
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
    </AppView>
  );
}
export default App;

const AppView = styled.div`
  background: #282c34;
  min-width: none;
  height: 100vh;
  color: #fff;
  overflow: hidden;
`;
