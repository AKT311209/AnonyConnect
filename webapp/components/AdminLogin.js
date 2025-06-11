import React, { useState } from 'react';
import TurnstileWidget from './TurnstileWidget';

const AdminLoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileValid, setTurnstileValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!turnstileValid) return;
    onLogin(username, password, rememberMe, turnstileToken);
  };

  return (
    <section className="position-relative py-4 py-xl-5 mt-3">
      <div className="container position-relative">
        <div className="row pb-3 mb-1">
          <div className="col-md-8 col-xl-6 text-center mx-auto">
            <h2 className="text-primary"><strong>Welcome back!</strong></h2>
          </div>
        </div>
        <div className="login-card mt-4 mb-4" style={{ boxShadow: '0px 0px' }}>
          <img className="object-fit-fill profile-img-card" src="/assets/img/profilepic.jpg" alt="Profile" />
          <p className="profile-name-card"> </p>
          <form className="form-signin" onSubmit={handleSubmit}>
            <span className="reauth-email"> </span>
            <input className="form-control" type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="form-control" type="password" id="inputPassword" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="checkbox">
              <div className="form-check mb-2 mt-2">
                <input className="form-check-input" type="checkbox" id="formCheck-1" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label className="form-check-label" htmlFor="formCheck-1">Remember me</label>
              </div>
            </div>
            <div className="mb-3">
              <TurnstileWidget
                onSuccess={token => { setTurnstileToken(token); setTurnstileValid(true); }}
                onExpire={() => { setTurnstileToken(''); setTurnstileValid(false); }}
                className="w-100"
              />
            </div>
            <button className="btn btn-primary btn-lg d-block btn-signin w-100" type="submit" disabled={!turnstileValid}>Sign in</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginForm;
