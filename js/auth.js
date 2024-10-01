import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging.js";

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
const messaging = getMessaging(app);

// Request permission to send notifications
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const currentToken = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
            if (currentToken) {
                console.log('FCM Token:', currentToken);
                // Save the token to Firestore
                const user = auth.currentUser;
                if (user) {
                    await updateDoc(doc(db, "users", user.uid), { fcmToken: currentToken });
                }
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        } else {
            console.log('Unable to get permission to notify.');
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
    }
}

// Handle incoming messages
onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Show notification to the user
    alert(`${payload.notification.title}: ${payload.notification.body}`);
});

// Call this function when the user signs in
function initializeAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.body.style.display = 'block';
            console.log('User is signed in:', user);
            const userEmailElement = document.getElementById('user-email');
            if (userEmailElement) {
                userEmailElement.textContent = `User: ${user.email}`;
            }
            loadAllTasks();
            loadMyTasks(user.email);
            requestNotificationPermission();
        } else {
            window.location.href = 'index.html';
        }
    });
}

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

async function loadAllTasks() {
    console.log('Fetching all tasks from backend...');
    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    populateTasksTable('current-tasks-body', tasks);
}

async function loadMyTasks(userEmail) {
    console.log('Fetching my tasks from backend...');
    const q = query(collection(db, "tasks"), where("assignedTo", "==", userEmail));
    const tasksSnapshot = await getDocs(q);
    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    populateTasksTable('my-tasks-body', tasks);
}

function populateTasksTable(tableId, tasks) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = ''; // Clear existing content
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.assignedTo}</td>
            <td class="task-action">
                <button class="update-btn" onclick="editTask('${task.id}', '${task.name}', '${task.assignedTo}')">Update</button>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
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
    try {
        await updateDoc(doc(db, "tasks", id), updatedData);
        console.log("Document updated with ID: ", id);
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}

async function deleteTask(id) {
    try {
        await deleteDoc(doc(db, "tasks", id));
        console.log("Document deleted with ID: ", id);
        // Reload tasks after deletion
        loadAllTasks();
        const userEmail = auth.currentUser.email;
        loadMyTasks(userEmail);
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
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