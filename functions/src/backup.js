const functions = require('firebase-functions');
// Daily Firestore export to Cloud Storage. Requires:
// - Firestore Admin API enabled
// - service account roles/datastore.importExportAdmin
// - BACKUP_BUCKET env / config (gs://bucket-name)
exports.scheduledBackup = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Europe/Istanbul')
  .onRun(async () => {
    const projectId = process.env.GCLOUD_PROJECT;
    const bucket = functions.config().backup?.bucket || process.env.BACKUP_BUCKET;
    if (!bucket) {
      console.warn('BACKUP_BUCKET not configured, skipping backup.');
      return null;
    }

    const date = new Date().toISOString().slice(0, 10);
    const outputUriPrefix = `${bucket}/${date}`;

    // Firestore admin export via REST.
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/datastore'],
    });
    const client = await auth.getClient();
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default):exportDocuments`;
    const res = await client.request({
      url,
      method: 'POST',
      data: { outputUriPrefix },
    });

    console.log(`Backup started: ${outputUriPrefix}`, res.data?.name);
    return null;
  });
