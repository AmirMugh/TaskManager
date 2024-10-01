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

export async function logout() {
    try {
        await signOut(auth);
        console.log('User signed out');
        window.location.href = 'index.html'; // Redirect to login page
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Manage user state changes
export function initializeAuthStateListener() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, show the content
      document.body.style.display = 'block';
      console.log('User is signed in:', user);
      
      // Display user email
      const userEmailElement = document.getElementById('user-email');
      userEmailElement.textContent = `User: ${user.email}`;
    } else {
      // No user is signed in, redirect to login page
      window.location.href = 'index.html';
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

// Function to load all tasks
function loadAllTasks() {
    // This function will fetch all tasks from the backend
    // and populate the "Current Tasks" table
    console.log('Fetching all tasks from backend...');
    // TODO: Implement backend fetch and table population
}

// Function to load tasks for the current user
function loadMyTasks() {
    // This function will fetch tasks assigned to the current user
    // and populate the "My Tasks" table
    console.log('Fetching my tasks from backend...');
    // TODO: Implement backend fetch and table population
}

// Load tasks when the page loads
window.onload = function() {
    loadAllTasks();
    loadMyTasks();
};

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

// Usage
// createTaskNew({
//   name: "Complete project",
//   description: "Finish the family task manager project",
//   assignedTo: "user@example.com",
//   urgency: "high",
//   dueDate: new Date("2023-12-31")
// })
//   .then(taskId => {
//     console.log("New task created with ID:", taskId);
//   })
//   .catch(error => {
//     console.error("Failed to create task:", error);
//   });

// Make sure this line is at the end of your auth.js file
export { createTaskNew, logout, initializeAuthStateListener, handleSignOut, loadAllTasks, loadMyTasks, addTask, updateTask, deleteTask };
