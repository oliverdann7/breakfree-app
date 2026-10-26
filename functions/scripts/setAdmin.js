#!/usr/bin/env node
/**
 * Grant or revoke the `isAdmin` custom claim — the single admin flag checked by
 * firestore.rules (isAdmin()), the recomputeLeaderboard callable and the web
 * AdminPage. Run with credentials for the target project, e.g.:
 *
 *   cd functions
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
 *     node scripts/setAdmin.js grant ops@breakfree.app
 *   node scripts/setAdmin.js revoke <uid-or-email>
 *
 * The user must sign out and back in (or wait up to an hour for the ID token
 * to refresh) before the change takes effect on their client.
 */

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

async function main() {
  const [action, who] = process.argv.slice(2);
  if (!['grant', 'revoke'].includes(action) || !who) {
    console.error('Usage: node scripts/setAdmin.js <grant|revoke> <uid-or-email>');
    process.exit(1);
  }

  initializeApp();
  const auth = getAuth();
  const user = who.includes('@') ? await auth.getUserByEmail(who) : await auth.getUser(who);

  // Merge so other claims on the account are preserved.
  const claims = { ...(user.customClaims || {}) };
  if (action === 'grant') claims.isAdmin = true;
  else delete claims.isAdmin;

  await auth.setCustomUserClaims(user.uid, claims);
  console.log(
    `${action === 'grant' ? 'Granted' : 'Revoked'} isAdmin for ${user.email || user.uid}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
