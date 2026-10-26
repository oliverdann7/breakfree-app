// firebase-admin/auth → shares state with the firebase-admin mock.
const admin = require('./firebase-admin');

module.exports = { getAuth: admin.auth };
