// firebase-admin/app → shares state with the firebase-admin mock.
const admin = require('./firebase-admin');

module.exports = { initializeApp: admin.initializeApp };
