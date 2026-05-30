// Phase 3 Sprint 11 — offline-first mirror.
// Wraps expo-sqlite for native + in-memory map for web fallback.
// Stays behind featureFlags.offlineMode until expo-sqlite is added to package.json
// and an EAS dev build is produced.

import { Platform } from 'react-native';
import { featureFlags } from '../constants/featureFlags';

let dbPromise = null;

async function getDb() {
  if (!featureFlags.offlineMode) return null;
  if (Platform.OS === 'web') return null;
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    try {
      const SQLite = await import('expo-sqlite');
      const db = SQLite.openDatabase('breakfree.db');
      await runSchema(db);
      return db;
    } catch (err) {
      // expo-sqlite not installed yet — graceful no-op.
      console.warn('[offlineStore] expo-sqlite not available:', err.message);
      return null;
    }
  })();
  return dbPromise;
}

function runSchema(db) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS health_metrics (
            date TEXT PRIMARY KEY,
            sleep_hours REAL,
            steps INTEGER,
            resting_hr INTEGER,
            hydration_ml INTEGER,
            mood INTEGER,
            synced_at INTEGER
          )`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS talks_cache (
            talk_id TEXT PRIMARY KEY,
            payload TEXT,
            cached_at INTEGER
          )`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS draft_posts (
            id TEXT PRIMARY KEY,
            uid TEXT,
            text TEXT,
            created_at INTEGER
          )`
        );
      },
      reject,
      resolve
    );
  });
}

function txQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result.rows?._array || result.rows || []),
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

// --- Public API ---

export async function upsertHealthMetric(metric) {
  const db = await getDb();
  if (!db) return;
  const { date, sleep, steps, heartRate, hydration, mood } = metric;
  await txQuery(
    db,
    `INSERT OR REPLACE INTO health_metrics
     (date, sleep_hours, steps, resting_hr, hydration_ml, mood, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [date, sleep, steps, heartRate, hydration, mood, Date.now()]
  );
}

export async function getRecentHealthMetrics(limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return txQuery(db, 'SELECT * FROM health_metrics ORDER BY date DESC LIMIT ?', [limit]);
}

export async function cacheTalk(talk) {
  const db = await getDb();
  if (!db) return;
  await txQuery(db, 'INSERT OR REPLACE INTO talks_cache VALUES (?, ?, ?)', [
    talk.id,
    JSON.stringify(talk),
    Date.now(),
  ]);
}

export async function getCachedTalks() {
  const db = await getDb();
  if (!db) return [];
  const rows = await txQuery(db, 'SELECT payload FROM talks_cache ORDER BY cached_at DESC');
  return rows.map((r) => JSON.parse(r.payload));
}

export async function saveDraftPost(draft) {
  const db = await getDb();
  if (!db) return;
  await txQuery(db, 'INSERT OR REPLACE INTO draft_posts VALUES (?, ?, ?, ?)', [
    draft.id,
    draft.uid,
    draft.text,
    Date.now(),
  ]);
}

export async function getDraftPosts(uid) {
  const db = await getDb();
  if (!db) return [];
  return txQuery(db, 'SELECT * FROM draft_posts WHERE uid = ? ORDER BY created_at DESC', [uid]);
}

export async function clearDraft(id) {
  const db = await getDb();
  if (!db) return;
  await txQuery(db, 'DELETE FROM draft_posts WHERE id = ?', [id]);
}

export const __forTests = { getDb };
