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

const TABS = [
  { id: 'talks', label: 'Talks', collection: 'talks' },
  { id: 'mentors', label: 'Mentors', collection: 'mentors' },
  { id: 'challenges', label: 'Challenges', collection: 'challenges' },
  { id: 'feedback', label: 'Feedback', collection: 'feedback' },
];

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

function CollectionTable({ collectionName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
