import React, { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

export default function Forum() {
  const { t } = useLang();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [f, setF] = useState({ title: '', body: '' });
  const [reply, setReply] = useState({});
  const [err, setErr] = useState('');

  const load = () => api.get('/forum').then((r) => setPosts(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post('/forum', f); setF({ title: '', body: '' }); load(); } catch (x) { setErr(errMsg(x)); }
  };
  const sendReply = async (id) => {
    if (!reply[id]) return;
    await api.post(`/forum/${id}/reply`, { text: reply[id] });
    setReply({ ...reply, [id]: '' });
    load();
  };
  const remove = async (id) => { await api.delete(`/forum/${id}`); load(); };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="panel" onSubmit={submit}>
          <h4>{t('forum')}</h4>
          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          <input className="form-control mb-2" placeholder={t('title')} aria-label={t('title')} required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <textarea className="form-control mb-3" rows={4} placeholder={t('body')} aria-label={t('body')} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          <button className="btn btn-field w-100">{t('post')}</button>
        </form>
      </div>
      <div className="col-lg-8">
        {posts.map((p) => (
          <div className="panel mb-3" key={p._id}>
            <div className="d-flex justify-content-between">
              <h5>{p.title}</h5>
              {(user.role === 'admin' || p.author?._id === user.id) && <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p._id)}>{t('delete')}</button>}
            </div>
            <small className="text-muted">{p.author?.name}{p.author?.role === 'admin' ? ' (expert)' : ''}</small>
            <p className="mt-2">{p.body}</p>
            {p.replies.map((r, i) => <div key={i} className="border-start ps-2 mb-1">{r.text}</div>)}
            <div className="input-group input-group-sm mt-2">
              <input className="form-control" placeholder={t('reply')} aria-label={t('reply')} value={reply[p._id] || ''} onChange={(e) => setReply({ ...reply, [p._id]: e.target.value })} />
              <button className="btn btn-field" onClick={() => sendReply(p._id)}>{t('reply')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
