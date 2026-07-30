const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./drive-95bb0-firebase-adminsdk-fbsvc-5c0c8dcf0f.json");

initializeApp({
    credential: cert(serviceAccount)
});

module.exports = {
    auth: getAuth()
};