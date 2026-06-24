// Stand-in for `google-auth-library` used by the scheduled backup function.
// The client just echoes a fake operation name so the happy path is assertable.
const requestMock = jest.fn().mockResolvedValue({ data: { name: 'operations/fake' } });

class GoogleAuth {
  getClient() {
    return Promise.resolve({ request: requestMock });
  }
}

module.exports = { GoogleAuth, __requestMock: requestMock };
