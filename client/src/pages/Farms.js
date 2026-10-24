import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';

const empty = { name: '', city: '', state: '', lat: '', lon: '', sizeAcres: '' };

export default function Farms() {
  const { t } = useLang();
  const [farms, setFarms] = useState([]);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');

  const load = () => api.get('/farms').then((r) => setFarms(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/farms', {
        name: f.name,
        sizeAcres: Number(f.sizeAcres) || undefined,
        location: { city: f.city, state: f.state, lat: f.lat === '' ? undefined : Number(f.lat), lon: f.lon === '' ? undefined : Number(f.lon) }
      });
      setF(empty);
      load();
    } catch (x) { setErr(errMsg(x)); }
  };
  const remove = async (id) => { await api.delete(`/farms/${id}`); load(); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="panel" onSubmit={submit}>
          <h4>{t('farms')}</h4>
          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          <input className="form-control mb-2" placeholder={t('farmName')} aria-label={t('farmName')} required value={f.name} onChange={set('name')} />
          <input className="form-control mb-2" placeholder={t('city')} aria-label={t('city')} value={f.city} onChange={set('city')} />
          <input className="form-control mb-2" placeholder={t('state')} aria-label={t('state')} value={f.state} onChange={set('state')} />
          <div className="row g-2 mb-2">
            <div className="col"><input className="form-control" type="number" step="any" placeholder={t('latitude')} aria-label={t('latitude')} value={f.lat} onChange={set('lat')} /></div>
            <div className="col"><input className="form-control" type="number" step="any" placeholder={t('longitude')} aria-label={t('longitude')} value={f.lon} onChange={set('lon')} /></div>
          </div>
          <input className="form-control mb-3" type="number" placeholder={t('acres')} aria-label={t('acres')} value={f.sizeAcres} onChange={set('sizeAcres')} />
          <button className="btn btn-field w-100">{t('add')}</button>
        </form>
      </div>
      <div className="col-lg-8">
        {farms.length === 0 && <p>{t('noFarms')}</p>}
        <div className="row g-3">
          {farms.map((x) => (
            <div className="col-md-6" key={x._id}>
              <div className="panel h-100">
                <h5><Link to={`/farms/${x._id}`}>{x.name}</Link></h5>
                <p className="mb-2">{[x.location?.city, x.location?.state].filter(Boolean).join(', ')}{x.sizeAcres ? ` · ${x.sizeAcres} ac` : ''}</p>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(x._id)}>{t('delete')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
