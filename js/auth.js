// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBx4qK5CrTnpExMkeH5E-7bWP0He5WWOGQ",
    authDomain: "familytaskmanager-c7a5f.firebaseapp.com",
    projectId: "familytaskmanager-c7a5f",
    storageBucket: "familytaskmanager-c7a5f.appspot.com",
    messagingSenderId: "119108959202",
    appId: "1:119108959202:web:cc3b79cbdd17b5d0bed7bb"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Sign in with Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User logged in:', user);
      // Redirect is handled by onAuthStateChanged
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error logging in:', errorCode, errorMessage);
      // Display error message to the user
      alert("Login failed: " + errorMessage);
    });
}

// Manage user state changes
export function initializeAuthStateListener() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log('User is signed in:', user);
      // Update UI or redirect to dashboard
      window.location.href = 'https://amirmugh.github.io/serv/login.html';
    } else {
      // User is signed out
      console.log('No user is signed in.');
      // Update UI or redirect to login page
      // If we're not already on the login page, redirect there
      if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = 'https://amirmugh.github.io/serv/index.html';
      }
    }
  });
}

export function handleSignOut() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('User signed out');
  }).catch((error) => {
    // An error happened.
    console.error('Error signing out:', error);
  });
}
