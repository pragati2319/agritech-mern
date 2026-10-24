import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { errMsg } from '../api';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await login(f.email, f.password); nav('/'); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <form className="panel" onSubmit={submit}>
          <h2 className="mb-3">{t('login')}</h2>
          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          <label className="form-label" htmlFor="email">{t('email')}</label>
          <input id="email" type="email" className="form-control mb-3" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <label className="form-label" htmlFor="pw">{t('password')}</label>
          <input id="pw" type="password" className="form-control mb-3" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button className="btn btn-field w-100">{t('login')}</button>
          <p className="mt-3 mb-0">{t('newHere')} <Link to="/register">{t('register')}</Link></p>
        </form>
      </div>
    </div>
  );
}
