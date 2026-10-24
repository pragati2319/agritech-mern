import React, { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';

export default function Crops() {
  const { t } = useLang();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [f, setF] = useState({ name: '', farm: '', sownOn: '' });
  const [err, setErr] = useState('');
  const [note, setNote] = useState({});
  const [pest, setPest] = useState({});

  const load = () => api.get('/crops').then((r) => setCrops(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => {
    load();
    api.get('/farms').then((r) => { setFarms(r.data); if (r.data[0]) setF((p) => ({ ...p, farm: r.data[0]._id })); });
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    try { await api.post('/crops', { ...f, sownOn: f.sownOn || undefined }); setF({ ...f, name: '', sownOn: '' }); load(); } catch (x) { setErr(errMsg(x)); }
  };
  const setStatus = async (id, status) => { await api.put(`/crops/${id}`, { status }); load(); };
  const addNote = async (id) => { if (!note[id]) return; await api.post(`/crops/${id}/log`, { note: note[id] }); setNote({ ...note, [id]: '' }); load(); };
  const addPest = async (id) => {
    const p = pest[id];
    if (!p || !p.pest) return;
    await api.post(`/weather/pest/${id}`, { pest: p.pest, severity: p.severity || 'low' });
    setPest({ ...pest, [id]: { pest: '', severity: 'low' } });
    load();
  };
  const remove = async (id) => { await api.delete(`/crops/${id}`); load(); };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="panel" onSubmit={add}>
          <h4>{t('crops')}</h4>
          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          <input className="form-control mb-2" placeholder={t('cropName')} aria-label={t('cropName')} required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <select className="form-select mb-2" aria-label={t('farm')} required value={f.farm} onChange={(e) => setF({ ...f, farm: e.target.value })}>
            {farms.length === 0 && <option value="">{t('noFarms')}</option>}
            {farms.map((x) => <option key={x._id} value={x._id}>{x.name}</option>)}
          </select>
          <input className="form-control mb-3" type="date" aria-label="Sown on" value={f.sownOn} onChange={(e) => setF({ ...f, sownOn: e.target.value })} />
          <button className="btn btn-field w-100" disabled={!f.farm}>{t('add')}</button>
        </form>
      </div>
      <div className="col-lg-8">
        {crops.length === 0 && <p>{t('noCrops')}</p>}
        {crops.map((c) => (
          <div className="panel mb-3" key={c._id}>
            <div className="d-flex justify-content-between align-items-start">
              <div><h5 className="mb-0">{c.name}</h5><small>{c.farm?.name}</small></div>
              <div className="d-flex gap-2">
                <select className="form-select form-select-sm" aria-label={t('status')} value={c.status} onChange={(e) => setStatus(c._id, e.target.value)}>
                  <option value="sown">sown</option><option value="growing">growing</option><option value="harvested">harvested</option>
                </select>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c._id)}>{t('delete')}</button>
              </div>
            </div>
            {c.pestAlerts?.map((a, i) => <div className="alert-pest mt-2" key={i}>{a.pest} ({a.severity})</div>)}
            <ul className="small mt-2 mb-2">{c.activityLog?.slice(-3).map((l, i) => <li key={i}>{l.note}</li>)}</ul>
            <div className="input-group input-group-sm mb-2">
              <input className="form-control" placeholder={t('addLog')} aria-label={t('addLog')} value={note[c._id] || ''} onChange={(e) => setNote({ ...note, [c._id]: e.target.value })} />
              <button className="btn btn-field" onClick={() => addNote(c._id)}>{t('add')}</button>
            </div>
            <div className="input-group input-group-sm">
              <input className="form-control" placeholder={t('pest')} aria-label={t('pest')} value={pest[c._id]?.pest || ''} onChange={(e) => setPest({ ...pest, [c._id]: { ...pest[c._id], pest: e.target.value } })} />
              <select className="form-select" aria-label={t('severity')} value={pest[c._id]?.severity || 'low'} onChange={(e) => setPest({ ...pest, [c._id]: { ...pest[c._id], severity: e.target.value } })}>
                <option>low</option><option>medium</option><option>high</option>
              </select>
              <button className="btn btn-outline-dark" onClick={() => addPest(c._id)}>{t('pestAlert')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
