const functions = require('firebase-functions');
const { __requestMock } = require('google-auth-library');
const { scheduledBackup } = require('../src/backup');

describe('scheduledBackup', () => {
  let warnSpy;
  let logSpy;

  beforeEach(() => {
    functions.__resetConfig();
    __requestMock.mockClear();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    process.env.GCLOUD_PROJECT = 'breakfree-test';
    delete process.env.BACKUP_BUCKET;
  });

  afterEach(() => {
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('skips and warns when no backup bucket is configured', async () => {
    const result = await scheduledBackup();
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    expect(__requestMock).not.toHaveBeenCalled();
  });

  it('triggers a Firestore export to the configured bucket', async () => {
    functions.__setConfig({ backup: { bucket: 'gs://bf-backups' } });
    const result = await scheduledBackup();
    expect(result).toBeNull();
    expect(__requestMock).toHaveBeenCalledTimes(1);
    const req = __requestMock.mock.calls[0][0];
    expect(req.method).toBe('POST');
    expect(req.url).toContain('projects/breakfree-test/databases/(default):exportDocuments');
    expect(req.data.outputUriPrefix).toContain('gs://bf-backups/');
  });
});
