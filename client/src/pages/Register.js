import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { errMsg } from '../api';

export default function Register() {
  const { register } = useAuth();
  const { t, lang } = useLang();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await register({ ...f, language: lang }); nav('/'); } catch (x) { setErr(errMsg(x)); }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <form className="panel" onSubmit={submit}>
          <h2 className="mb-3">{t('register')}</h2>
          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          <label className="form-label" htmlFor="n">{t('name')}</label>
          <input id="n" className="form-control mb-3" required value={f.name} onChange={set('name')} />
          <label className="form-label" htmlFor="e">{t('email')}</label>
          <input id="e" type="email" className="form-control mb-3" required value={f.email} onChange={set('email')} />
          <label className="form-label" htmlFor="p">{t('password')}</label>
          <input id="p" type="password" minLength={6} className="form-control mb-3" required value={f.password} onChange={set('password')} />
          <button className="btn btn-field w-100">{t('register')}</button>
          <p className="mt-3 mb-0">{t('haveAccount')} <Link to="/login">{t('login')}</Link></p>
        </form>
      </div>
    </div>
  );
}
