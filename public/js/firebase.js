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

let authType = null;

const loginBtn = document.getElementById("googleLoginBtn");
const registerBtn = document.getElementById("googleRegisterBtn");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        authType = "login";
        handleGoogleSignIn(loginBtn);
    });
}

if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        authType = "register";
        handleGoogleSignIn(registerBtn);
    });
}

async function loginToBackend(user) {

    const idToken = await user.getIdToken();

    const endpoint =
        authType === "register"
            ? "/user/google-register"
            : "/user/google-login";

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (data.success) {

        toastr.success(
            authType === "register"
                ? "Account created successfully!"
                : "Welcome back!"
        );

        localStorage.removeItem("authType");

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 700);

    } else {

        toastr.error(data.message);

    }

}

async function handleGoogleSignIn(button) {

    try {

        button.disabled = true;

        button.innerHTML = `
            <i class="ri-loader-4-line animate-spin text-xl"></i>
            <span>
                ${authType === "register"
                    ? "Creating account..."
                    : "Signing in..."}
            </span>
        `;

        const isMobile =
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {

            localStorage.setItem("authType", authType);

            await signInWithRedirect(auth, provider);

        } else {

            const result = await signInWithPopup(auth, provider);

            await loginToBackend(result.user);

        }

    } catch (err) {

        console.error(err);

        toastr.error(err.message || "Google Sign-In Failed");

        button.disabled = false;

        button.innerHTML = `
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5">
            <span>Continue with Google</span>
        `;

    }

}

try {

    const redirectResult = await getRedirectResult(auth);

    if (redirectResult) {

        authType = localStorage.getItem("authType");

        await loginToBackend(redirectResult.user);

    }

} catch (err) {

    console.error(err);

    toastr.error(err.message);

}

export {
    auth,
    provider,
    signInWithPopup,
    signInWithRedirect
};
