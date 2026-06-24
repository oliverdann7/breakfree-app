const admin = require('firebase-admin');
const { processPrivacyRequest } = require('../src/privacyRequest');

function mockSnap(request) {
  return {
    data: () => request,
    ref: { update: jest.fn().mockResolvedValue(undefined) },
  };
}

describe('processPrivacyRequest', () => {
  let errorSpy;
  beforeEach(() => {
    admin.__reset();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => errorSpy.mockRestore());

  it('exports user data and stores a signed URL', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const getSignedUrl = jest.fn().mockResolvedValue(['https://signed.example/export.json']);
    admin.__api.firestoreApi.doc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: () => ({ nickname: 'A' }) }),
    });
    admin.__api.firestoreApi.collection.mockReturnValue({
      get: jest.fn().mockResolvedValue({ docs: [] }),
    });
    admin.__api.storageApi.bucket.mockReturnValue({
      file: jest.fn(() => ({ save: saveMock, getSignedUrl })),
    });

    const snap = mockSnap({ type: 'export' });
    await processPrivacyRequest(snap, { params: { uid: 'u1' } });

    expect(saveMock).toHaveBeenCalled();
    expect(snap.ref.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        exportUrl: 'https://signed.example/export.json',
      })
    );
  });

  it('tombstones the account and disables auth on a delete request', async () => {
    const updateMock = jest.fn().mockResolvedValue(undefined);
    admin.__api.firestoreApi.doc.mockReturnValue({ update: updateMock });

    const snap = mockSnap({ type: 'delete' });
    await processPrivacyRequest(snap, { params: { uid: 'u2' } });

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ accountStatus: 'pending_deletion' })
    );
    expect(admin.__api.authApi.updateUser).toHaveBeenCalledWith('u2', { disabled: true });
    expect(snap.ref.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'pending_cooloff' })
    );
  });

  it('flags an unknown request type as an error', async () => {
    const snap = mockSnap({ type: 'frobnicate' });
    await processPrivacyRequest(snap, { params: { uid: 'u3' } });
    expect(snap.ref.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', error: 'Unknown request type' })
    );
  });

  it('captures failures and records the error message', async () => {
    admin.__api.firestoreApi.doc.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('boom')),
    });
    const snap = mockSnap({ type: 'export' });
    await processPrivacyRequest(snap, { params: { uid: 'u4' } });
    expect(snap.ref.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', error: 'boom' })
    );
  });
});
