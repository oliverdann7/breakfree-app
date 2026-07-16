import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../store/hooks';
import { parseYouTubeId } from '../../utils/videoSource';

const TABS = [
  { id: 'talks', label: 'Talks', collection: 'talks' },
  { id: 'videos', label: 'Videos', collection: 'videos' },
  { id: 'mentors', label: 'Mentors', collection: 'mentors' },
  { id: 'challenges', label: 'Challenges', collection: 'challenges' },
  { id: 'feedback', label: 'Feedback', collection: 'feedback' },
];

const VIDEO_CATEGORIES = ['Zihin', 'Sağlık', 'Beslenme', 'Hareket', 'Uyku'];

function AdminGate({ children }) {
  const { user } = useAppSelector((s) => s.auth);
  // Admin claim is normally read from getIdTokenResult().claims.admin.
  // For the scaffold, accept env-set allowlist of UIDs.
  const allowed = (process.env.EXPO_PUBLIC_ADMIN_UIDS || '').split(',').map((s) => s.trim());
  const isAdmin = user && allowed.includes(user.uid);

  if (!user) {
    return <Locked message="Sign in to access admin." />;
  }
  if (!isAdmin) {
    return <Locked message={`Forbidden — ${user.email} is not an admin.`} />;
  }
  return children;
}

function Locked({ message }) {
  return (
    <div style={styles.locked}>
      <h1 style={{ color: '#FFF' }}>BreakFree Admin</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>{message}</p>
      <a href="/" style={{ color: '#14B8D4' }}>
        ← Back
      </a>
    </div>
  );
}

// Structured add form for the `videos` catalog: paste a YouTube link (or a
// direct stream URL) instead of hand-writing the document JSON. Writes the
// provider-agnostic shape the players expect (see utils/videoSource.js).
function AddVideoForm({ onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    hostName: '',
    description: '',
    category: VIDEO_CATEGORIES[0],
    source: 'youtube',
    sourceInput: '',
    thumbnailUrl: '',
    durationMinutes: '',
    isPremium: true,
    tags: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const youtubeId = form.source === 'youtube' ? parseYouTubeId(form.sourceInput) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) return setError('Title is required.');
    if (form.source === 'youtube' && !youtubeId) {
      return setError('Paste a valid YouTube link or 11-character video id.');
    }
    if (form.source === 'url' && !/^https:\/\//.test(form.sourceInput.trim())) {
      return setError('Direct source must be an https:// stream URL.');
    }

    const durationMinutes = Number(form.durationMinutes);
    const video = {
      title: form.title.trim(),
      hostName: form.hostName.trim(),
      description: form.description.trim(),
      category: form.category,
      source: form.source,
      sourceId: form.source === 'youtube' ? youtubeId : null,
      sourceUrl: form.source === 'url' ? form.sourceInput.trim() : null,
      thumbnailUrl: form.thumbnailUrl.trim() || null,
      durationSeconds: durationMinutes > 0 ? Math.round(durationMinutes * 60) : null,
      isPremium: form.isPremium,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      publishedAt: Date.now(),
      createdAt: Date.now(),
    };

    setSaving(true);
    try {
      await addDoc(collection(db, 'videos'), video);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formRow}>
        <label style={styles.label}>
          Title *
          <input style={styles.input} value={form.title} onChange={set('title')} />
        </label>
        <label style={styles.label}>
          Host
          <input style={styles.input} value={form.hostName} onChange={set('hostName')} />
        </label>
      </div>

      <label style={styles.label}>
        Description
        <textarea
          style={{ ...styles.input, minHeight: 60 }}
          value={form.description}
          onChange={set('description')}
        />
      </label>

      <div style={styles.formRow}>
        <label style={styles.label}>
          Category
          <select style={styles.input} value={form.category} onChange={set('category')}>
            {VIDEO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label style={styles.label}>
          Source
          <select style={styles.input} value={form.source} onChange={set('source')}>
            <option value="youtube">YouTube</option>
            <option value="url">Direct URL (mp4/HLS)</option>
          </select>
        </label>
        <label style={styles.label}>
          Duration (minutes)
          <input
            style={styles.input}
            type="number"
            min="0"
            value={form.durationMinutes}
            onChange={set('durationMinutes')}
          />
        </label>
      </div>

      <label style={styles.label}>
        {form.source === 'youtube' ? 'YouTube link or video id *' : 'Stream URL (https) *'}
        <input
          style={styles.input}
          value={form.sourceInput}
          onChange={set('sourceInput')}
          placeholder={
            form.source === 'youtube'
              ? 'https://www.youtube.com/watch?v=...'
              : 'https://cdn.example.com/video.m3u8'
          }
        />
      </label>

      {youtubeId && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
            alt="YouTube thumbnail preview"
            style={{ width: 120, borderRadius: 8 }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>id: {youtubeId}</span>
        </div>
      )}

      {form.source === 'url' && (
        <label style={styles.label}>
          Thumbnail URL (optional)
          <input style={styles.input} value={form.thumbnailUrl} onChange={set('thumbnailUrl')} />
        </label>
      )}

      <div style={styles.formRow}>
        <label style={styles.label}>
          Tags (comma-separated)
          <input style={styles.input} value={form.tags} onChange={set('tags')} />
        </label>
        <label style={{ ...styles.label, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={form.isPremium} onChange={set('isPremium')} />
          Pro-only (locked for free users)
        </label>
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: 12, margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="submit"
          disabled={saving}
          style={{ ...styles.btn, background: '#14B8D4', color: '#0A2540' }}
        >
          {saving ? 'Saving...' : 'Save video'}
        </button>
        <button type="button" style={styles.btn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function CollectionTable({ collectionName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoForm, setShowVideoForm] = useState(false);

  const load = async () => {
    setLoading(true);
    if (!db) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.warn('admin load failed', err);
      // Fall back without orderBy if the collection has no createdAt.
      const snap = await getDocs(collection(db, collectionName));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [collectionName]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete ${id}?`)) return;
    await deleteDoc(doc(db, collectionName, id));
    load();
  };

  const handleAdd = async () => {
    // Videos get a structured form; other collections keep the raw-JSON flow.
    if (collectionName === 'videos') {
      setShowVideoForm((v) => !v);
      return;
    }
    const raw = window.prompt('Paste JSON for new document:');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      await addDoc(collection(db, collectionName), { ...data, createdAt: Date.now() });
      load();
    } catch (e) {
      window.alert(`Invalid JSON: ${e.message}`);
    }
  };

  return (
    <div>
      <div style={styles.tableHead}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
          {loading ? 'Loading...' : `${items.length} items`}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={styles.btn} onClick={load}>
            Reload
          </button>
          <button
            style={{ ...styles.btn, background: '#14B8D4', color: '#0A2540' }}
            onClick={handleAdd}
          >
            + Add
          </button>
        </div>
      </div>

      {showVideoForm && (
        <AddVideoForm
          onSaved={() => {
            setShowVideoForm(false);
            load();
          }}
          onCancel={() => setShowVideoForm(false)}
        />
      )}

      <div style={styles.tableWrap}>
        {items.length === 0 && !loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', padding: 20 }}>No documents.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={styles.row}>
              <div style={{ flex: 1 }}>
                <div style={styles.rowId}>{item.id}</div>
                <pre style={styles.rowJson}>
                  {JSON.stringify(
                    Object.fromEntries(
                      Object.entries(item)
                        .filter(([k]) => k !== 'id')
                        .slice(0, 6)
                    ),
                    null,
                    2
                  )}
                </pre>
              </div>
              <button style={styles.delBtn} onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('talks');
  const currentCollection = useMemo(
    () => TABS.find((t) => t.id === tab)?.collection || 'talks',
    [tab]
  );

  return (
    <AdminGate>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={{ color: '#FFF', margin: 0, fontSize: 22 }}>BreakFree Admin</h1>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            ← App
          </a>
        </header>

        <nav style={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...styles.tab,
                ...(tab === t.id ? styles.tabActive : null),
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <CollectionTable collectionName={currentCollection} />
      </div>
    </AdminGate>
  );
}

const styles = {
  shell: { minHeight: '100vh', background: '#061829', padding: 24, color: '#FFF' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: 12,
  },
  tab: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 999,
    color: 'rgba(255,255,255,0.6)',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 13,
  },
  tabActive: { background: '#14B8D4', color: '#0A2540', borderColor: '#14B8D4', fontWeight: 700 },
  tableHead: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  btn: {
    background: 'rgba(255,255,255,0.06)',
    color: '#FFF',
    border: 'none',
    padding: '7px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 12,
  },
  tableWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    marginBottom: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
  },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
    minWidth: 160,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#FFF',
    padding: '8px 10px',
    fontSize: 13,
  },
  row: {
    display: 'flex',
    gap: 12,
    padding: 12,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  rowId: { color: '#14B8D4', fontWeight: 700, fontSize: 12, marginBottom: 4 },
  rowJson: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    margin: 0,
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
  delBtn: {
    background: 'transparent',
    border: '1px solid #EF4444',
    color: '#EF4444',
    borderRadius: 6,
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 11,
  },
  locked: {
    minHeight: '100vh',
    background: '#061829',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
};
