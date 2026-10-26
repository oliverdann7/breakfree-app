// firebase-admin/storage → shares state with the firebase-admin mock.
const admin = require('./firebase-admin');

module.exports = { getStorage: admin.storage };
