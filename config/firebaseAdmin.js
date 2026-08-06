const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./drive-95bb0-firebase-adminsdk-fbsvc-0cad435f73.json");

initializeApp({
    credential: cert(serviceAccount)
});

module.exports = {
    auth: getAuth()
};