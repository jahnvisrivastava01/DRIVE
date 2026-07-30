import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCON93Bro6tqjf3WAJgTeRITMx6dHFfAKs",
    authDomain: "drive-95bb0.firebaseapp.com",
    projectId: "drive-95bb0",
    storageBucket: "drive-95bb0.firebasestorage.app",
    messagingSenderId: "846779047497",
    appId: "1:846779047497:web:84a12eae4288838c6a6998",
    measurementId: "G-GLGEJX9JEB"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

async function loginToBackend(user) {
    const idToken = await user.getIdToken();

    const response = await fetch("/user/google-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = "/dashboard";
    } else {
        alert("Google Login Failed");
    }
}

document.getElementById("googleSignIn").addEventListener("click", async () => {
    try {

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            await signInWithRedirect(auth, provider);
        } else {
            const result = await signInWithPopup(auth, provider);
            await loginToBackend(result.user);
        }

    } catch (err) {
        console.error(err);
        alert("Google Sign-In Failed");
    }
});

try {
    const redirectResult = await getRedirectResult(auth);

    if (redirectResult) {
        await loginToBackend(redirectResult.user);
    }
} catch (err) {
    console.error(err);
}

export {
    auth,
    provider,
    signInWithPopup,
    signInWithRedirect
};