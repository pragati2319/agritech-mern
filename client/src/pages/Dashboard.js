import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/farms'), api.get('/crops'), api.get('/orders')])
      .then(([f, c, o]) => { setFarms(f.data); setCrops(c.data); setOrders(o.data); })
      .catch(() => {});
  }, []);

  const byStatus = ['sown', 'growing', 'harvested'].map((s) => ({ status: s, count: crops.filter((c) => c.status === s).length }));
  const alerts = crops.flatMap((c) => (c.pestAlerts || []).map((a) => ({ ...a, crop: c.name })));

  return (
    <>
      <div className="hero-field mb-4">
        <h2 className="mb-1">{t('welcome')}, {user.name}</h2>
        <p className="mb-0">{farms.length} {t('farms')} · {crops.length} {t('crops')} · {orders.length} {t('orders')}</p>
      </div>
      <div className="row g-3">
        <div className="col-md-4"><div className="stat"><div className="num">{farms.length}</div>{t('farms')}</div></div>
        <div className="col-md-4"><div className="stat"><div className="num">{crops.length}</div>{t('crops')}</div></div>
        <div className="col-md-4"><div className="stat"><div className="num">{orders.length}</div>{t('orders')}</div></div>
        <div className="col-md-7">
          <div className="panel">
            <h5>{t('crops')}</h5>
            {crops.length === 0 ? <p className="mb-0">{t('noCrops')} <Link to="/crops">{t('add')}</Link></p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byStatus}><XAxis dataKey="status" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#2d6a3e" /></BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-md-5">
          <div className="panel">
            <h5>{t('pestAlert')}</h5>
            {alerts.length === 0 && <p className="mb-0">—</p>}
            {alerts.slice(0, 5).map((a, i) => (
              <div key={i} className="alert-pest"><strong>{a.crop}</strong>: {a.pest} ({a.severity})</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
