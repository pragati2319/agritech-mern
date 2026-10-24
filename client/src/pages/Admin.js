import React, { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';

export default function Admin() {
  const { t } = useLang();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');

  const load = () =>
    Promise.all([api.get('/admin/stats'), api.get('/admin/users'), api.get('/admin/orders')])
      .then(([s, u, o]) => { setStats(s.data); setUsers(u.data); setOrders(o.data); })
      .catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);

  const setRole = async (id, role) => { await api.put(`/admin/users/${id}/role`, { role }); load(); };
  const removeUser = async (id) => { await api.delete(`/admin/users/${id}`); load(); };
  const setOrder = async (id, status) => { await api.put(`/admin/orders/${id}`, { status }); load(); };

  return (
    <>
      <h2 className="mb-3">{t('admin')}</h2>
      {err && <div className="alert alert-danger" role="alert">{err}</div>}
      <div className="row g-3 mb-4">
        {Object.entries(stats).map(([k, v]) => <div className="col-6 col-md-3" key={k}><div className="stat"><div className="num">{v}</div>{k}</div></div>)}
      </div>
      <div className="panel mb-4 table-responsive">
        <h5>{t('users')}</h5>
        <table className="table align-middle">
          <thead><tr><th>{t('name')}</th><th>{t('email')}</th><th>Role</th><th /></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td>
                <td>
                  <select className="form-select form-select-sm" aria-label="Role" value={u.role} onChange={(e) => setRole(u._id, e.target.value)}>
                    <option value="farmer">farmer</option><option value="admin">admin</option>
                  </select>
                </td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeUser(u._id)}>{t('delete')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel table-responsive">
        <h5>{t('orders')}</h5>
        <table className="table align-middle">
          <thead><tr><th>User</th><th>{t('total')}</th><th>{t('status')}</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.user?.name}</td><td>₹{o.total}</td>
                <td>
                  <select className="form-select form-select-sm" aria-label={t('status')} value={o.status} onChange={(e) => setOrder(o._id, e.target.value)}>
                    {['pending', 'approved', 'shipped', 'delivered', 'rejected'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
