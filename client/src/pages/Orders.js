import React, { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';

const catalog = [
  { resource: 'Seeds (5 kg)', price: 450 },
  { resource: 'Urea (50 kg)', price: 300 },
  { resource: 'DAP (50 kg)', price: 1350 },
  { resource: 'Organic compost (25 kg)', price: 250 },
  { resource: 'Neem pesticide (1 L)', price: 380 }
];

export default function Orders() {
  const { t } = useLang();
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');

  const load = () => api.get('/orders').then((r) => setOrders(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);

  const items = catalog.filter((c) => cart[c.resource] > 0).map((c) => ({ ...c, qty: cart[c.resource] }));
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const change = (r, d) => setCart({ ...cart, [r]: Math.max(0, (cart[r] || 0) + d) });

  const place = async () => {
    setErr('');
    try { await api.post('/orders', { items }); setCart({}); load(); } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="panel">
          <h4>{t('cart')}</h4>
          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          {catalog.map((c) => (
            <div key={c.resource} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <span>{c.resource} <small className="text-muted">₹{c.price}</small></span>
              <span className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-outline-dark" aria-label={`Remove ${c.resource}`} onClick={() => change(c.resource, -1)}>−</button>
                <strong>{cart[c.resource] || 0}</strong>
                <button className="btn btn-sm btn-outline-dark" aria-label={`Add ${c.resource}`} onClick={() => change(c.resource, 1)}>+</button>
              </span>
            </div>
          ))}
          <p className="mt-3 fs-5">{t('total')}: <strong>₹{total}</strong></p>
          <button className="btn btn-field" disabled={!items.length} onClick={place}>{t('place')}</button>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="panel">
          <h4>{t('orders')}</h4>
          {orders.map((o) => (
            <div key={o._id} className="border-bottom py-2">
              <div className="d-flex justify-content-between"><strong>₹{o.total}</strong><span className="badge bg-secondary">{o.status}</span></div>
              <small>{new Date(o.createdAt).toLocaleDateString()} · {o.items.map((i) => `${i.resource} × ${i.qty}`).join(', ')}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
