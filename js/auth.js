import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const db = getFirestore(app);

async function createTaskNew(taskData) {
    console.log("createTask called with:", taskData);
    try {
        const docRef = await addDoc(collection(db, "tasks"), taskData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}

async function logout() {
    try {
        await signOut(auth);
        console.log('User signed out');
        window.location.href = 'index.html'; // Redirect to login page
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

function initializeAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, show the content
            document.body.style.display = 'block';
            console.log('User is signed in:', user);
            
            // Display user email
            const userEmailElement = document.getElementById('user-email');
            if (userEmailElement) {
                userEmailElement.textContent = `User: ${user.email}`;
            }
        } else {
            // No user is signed in, redirect to login page
            window.location.href = 'index.html';
        }
    });
}

function loadAllTasks() {
    console.log('Fetching all tasks from backend...');
    // TODO: Implement backend fetch and table population
}

function loadMyTasks() {
    console.log('Fetching my tasks from backend...');
    // TODO: Implement backend fetch and table population
}

async function addTask(task) {
    try {
        const docRef = await addDoc(collection(db, "tasks"), task);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function updateTask(id, updatedData) {
    await updateDoc(doc(db, "tasks", id), updatedData);
}

async function deleteTask(id) {
    await deleteDoc(doc(db, "tasks", id));
}

export { 
    createTaskNew, 
    logout, 
    initializeAuthStateListener, 
    loadAllTasks, 
    loadMyTasks, 
    addTask, 
    updateTask, 
    deleteTask 
};