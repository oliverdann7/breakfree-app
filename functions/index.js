const admin = require('firebase-admin');

admin.initializeApp();

// Re-export each function module so Firebase CLI picks them up at deploy time.
exports.mintAgoraToken = require('./src/agoraToken').mintAgoraToken;
exports.revenueCatWebhook = require('./src/revenueCatWebhook').revenueCatWebhook;
exports.recomputeLeaderboard = require('./src/leaderboard').recomputeLeaderboard;
exports.onMetricUpdated = require('./src/leaderboard').onMetricUpdated;
exports.scheduledBackup = require('./src/backup').scheduledBackup;
exports.onNotificationCreated = require('./src/pushFanout').onNotificationCreated;
exports.processPrivacyRequest = require('./src/privacyRequest').processPrivacyRequest;
