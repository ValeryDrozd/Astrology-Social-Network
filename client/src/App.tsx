import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import ProfilePage from './pages/profilePage/profilePage';
import RegistrationPage from './pages/registrationPage/registrationPage';
import styled from 'styled-components';
import ChatPage from './pages/chatPage/chatPage';
//import chatStore from './stores/store';
import React from 'react';

//const chatStore = new ChatStore();

// const ChatPageWithStore = (): JSX.Element => <ChatPage store={chatStore} />;

function App(): JSX.Element {
  return (
    <AppView>
      <Router>
        <Switch>
          <Route path="/" exact component={LoginPage}></Route>
          <Route path="/profile" component={ProfilePage}></Route>
          <Route path="/chat" component={ChatPage}></Route>
          <Route path="/registration" component={RegistrationPage}></Route>
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
`;
