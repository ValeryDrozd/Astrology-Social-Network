import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import ProfilePage from './pages/profilePage/profilePage';
import RegistrationPage from './pages/registrationPage/registrationPage';

function App(): JSX.Element {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={LoginPage}></Route>
          <Route path="/profile" component={ProfilePage}></Route>
          <Route path="/registration" component={RegistrationPage}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
