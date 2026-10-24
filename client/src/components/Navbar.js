import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const nav = useNavigate();
  const link = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  return (
    <nav className="navbar navbar-expand-lg topbar">
      <div className="container">
        <NavLink className="navbar-brand" to="/">{t('appName')}</NavLink>
        <button className="navbar-toggler bg-light" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Menu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="menu">
          {user && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><NavLink className={link} to="/" end>{t('dashboard')}</NavLink></li>
              <li className="nav-item"><NavLink className={link} to="/farms">{t('farms')}</NavLink></li>
              <li className="nav-item"><NavLink className={link} to="/crops">{t('crops')}</NavLink></li>
              <li className="nav-item"><NavLink className={link} to="/orders">{t('orders')}</NavLink></li>
              <li className="nav-item"><NavLink className={link} to="/forum">{t('forum')}</NavLink></li>
              {user.role === 'admin' && <li className="nav-item"><NavLink className={link} to="/admin">{t('admin')}</NavLink></li>}
            </ul>
          )}
          <div className="d-flex gap-2 ms-auto align-items-center">
            <select className="form-select form-select-sm" aria-label={t('language')} value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            {user && (
              <button className="btn btn-sm btn-outline-light text-nowrap" onClick={() => { logout(); nav('/login'); }}>
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
