import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';

const soilFields = ['soilType', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'moisture'];

export default function FarmDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const [farm, setFarm] = useState(null);
  const [soil, setSoil] = useState(null);
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');

  const loadSoil = useCallback(() => api.get(`/soil/${id}`).then((r) => setSoil(r.data)).catch(() => {}), [id]);
  const loadHistory = useCallback(() => api.get(`/weather/${id}/history`).then((r) => setHistory(r.data.slice().reverse().map((w) => ({ time: new Date(w.fetchedAt).toLocaleTimeString(), temp: w.temp, humidity: w.humidity })))).catch(() => {}), [id]);

  useEffect(() => {
    api.get(`/farms/${id}`).then((r) => { setFarm(r.data); setForm(r.data.soil || {}); }).catch((e) => setMsg(errMsg(e)));
    loadSoil();
    loadHistory();
  }, [id, loadSoil, loadHistory]);

  const saveSoil = async (e) => {
    e.preventDefault();
    const soilData = {};
    soilFields.forEach((k) => { if (form[k] !== undefined && form[k] !== '') soilData[k] = k === 'soilType' ? form[k] : Number(form[k]); });
    await api.put(`/farms/${id}`, { soil: soilData });
    loadSoil();
  };

  const getWeather = async () => {
    setMsg('');
    try { setWeather((await api.get(`/weather/${id}`)).data); loadHistory(); } catch (e) { setMsg(errMsg(e)); }
  };

  if (!farm) return <p>{msg || t('loading')}</p>;

  return (
    <>
      <h2 className="mb-3">{farm.name}</h2>
      {msg && <div className="alert alert-warning" role="alert">{msg}</div>}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="panel h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{t('weather')}</h5>
              <button className="btn btn-sm btn-field" onClick={getWeather}>{t('refresh')}</button>
            </div>
            {weather && (
              <>
                <p className="fs-3 fw-bold mb-1">{Math.round(weather.weather.temp)}°C · {weather.weather.description}</p>
                <p>Humidity {weather.weather.humidity}% · Wind {weather.weather.wind} m/s</p>
                {weather.alerts.map((a, i) => <div className="alert-pest" key={i}>{a}</div>)}
              </>
            )}
            {history.length > 1 && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis /><Tooltip />
                  <Line dataKey="temp" stroke="#2d6a3e" name="Temp °C" /><Line dataKey="humidity" stroke="#e3b93c" name="Humidity %" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-lg-6">
          <form className="panel h-100" onSubmit={saveSoil}>
            <h5>{t('soil')}</h5>
            <div className="row g-2 mb-2">
              {soilFields.map((k) => (
                <div className="col-6" key={k}>
                  <label className="form-label small mb-0" htmlFor={k}>{k}</label>
                  <input id={k} className="form-control" type={k === 'soilType' ? 'text' : 'number'} step="any" value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
            </div>
            <button className="btn btn-field mb-3">{t('save')}</button>
            {soil && (
              <>
                <p className="fw-bold mb-1">{soil.status}</p>
                {soil.recommendations.map((r, i) => <div className="alert-pest" key={i}>{r}</div>)}
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
