import './loginPage.css';

function LoginPage(): JSX.Element {
  return (
    <div>
      <div className="login-div">
        <form className="login-form">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
          <div className="button-box">
            <button>Sign in</button>
            <button>Sign in with GOOGLE</button>
          </div>
        </form>
        <div className="button-box">
          <button>Sign up</button>
          <button>Sign up with GOOGLE</button>
        </div>
        <p>Login page</p>
      </div>
      <div></div>
    </div>
  );
}

export default LoginPage;
