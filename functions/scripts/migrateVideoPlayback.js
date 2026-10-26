#!/usr/bin/env node
/**
 * One-off migration: move playback fields (source, sourceId, sourceUrl,
 * muxPlaybackId) off Pro video catalog docs into videos/{id}/playback/current,
 * where firestore.rules can gate them. Free videos (isPremium === false) are
 * left untouched. Safe to re-run: docs without playback fields are skipped.
 *
 *   cd functions
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
 *     node scripts/migrateVideoPlayback.js            # dry run
 *   node scripts/migrateVideoPlayback.js --apply      # write changes
 *
 * Run this BEFORE deploying the new firestore.rules if admins will edit Pro
 * videos (the rules reject Pro catalog docs that still carry playback fields)
 * and before setting config/premium { enforced: true }.
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const PLAYBACK_FIELDS = ['source', 'sourceId', 'sourceUrl', 'muxPlaybackId'];

async function main() {
  const apply = process.argv.includes('--apply');
  initializeApp();
  const db = getFirestore();

  const snap = await db.collection('videos').get();
  let moved = 0;
  for (const videoDoc of snap.docs) {
    const data = videoDoc.data();
    if (data.isPremium === false) continue;
    const present = PLAYBACK_FIELDS.filter((key) => key in data);
    if (present.length === 0) continue;

    const playback = {};
    const removals = {};
    for (const key of present) {
      if (data[key] != null) playback[key] = data[key];
      removals[key] = FieldValue.delete();
    }
    console.log(`${apply ? 'Moving' : 'Would move'} ${present.join(', ')} for ${videoDoc.id}`);
    if (apply) {
      const batch = db.batch();
      batch.set(videoDoc.ref.collection('playback').doc('current'), playback, { merge: true });
      batch.update(videoDoc.ref, removals);
      await batch.commit();
    }
    moved += 1;
  }
  console.log(
    `${apply ? 'Migrated' : 'Dry run:'} ${moved} of ${snap.size} videos${apply ? '' : ' (pass --apply to write)'}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
