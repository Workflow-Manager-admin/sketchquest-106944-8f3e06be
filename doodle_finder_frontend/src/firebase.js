//
// Firebase service for multiplayer game: provides authentication and real-time database utilities.
//

// PUBLIC_INTERFACE
/**
 * Sets up Firebase (Auth, RTDB) and exposes helper functions for use in the app.
 *
 * Usage:
 *   import { auth, db, loginAnonymously, signOutUser, onAuthStateChanged, setGameData, onGameDataChanged } from './firebase';
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut, onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue, push, update, get, child } from "firebase/database";

// Firebase configuration for the project (public config OK in the client for Firebase projects)
const firebaseConfig = {
  apiKey: "AIzaSyBNA7xaoiynpwD8j3rE3qB9-daUnmDIbno",
  authDomain: "doodlefinder.firebaseapp.com",
  projectId: "doodlefinder",
  storageBucket: "doodlefinder.firebasestorage.app",
  messagingSenderId: "306458973633",
  appId: "1:306458973633:web:5862a96764e4bd75a6cb40",
  measurementId: "G-2H7VRGX2VY",
  databaseURL: "https://doodlefinder-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// PUBLIC_INTERFACE
/**
 * Anonymous login for multiplayer game
 * @returns {Promise<UserCredential>} Promise resolving to the user credential
 */
function loginAnonymously() {
  return signInAnonymously(auth);
}

// PUBLIC_INTERFACE
/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
function signOutUser() {
  return signOut(auth);
}

// PUBLIC_INTERFACE
/**
 * Listen to authentication state changes
 * @param {function} callback - Called with user or null
 */
function onAuthChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback);
}

// PUBLIC_INTERFACE
/**
 * Set or update game data at a specified path
 * @param {string} path - Path in the database (e.g., 'games/gameId')
 * @param {object} data - Data object to set/merge
 * @returns {Promise<void>}
 */
function setGameData(path, data) {
  return set(ref(db, path), data);
}

// PUBLIC_INTERFACE
/**
 * Update (merge, don't overwrite) game data at a specified path
 * @param {string} path
 * @param {object} data
 * @returns {Promise<void>}
 */
function updateGameData(path, data) {
  return update(ref(db, path), data);
}

// PUBLIC_INTERFACE
/**
 * Listen for real-time updates to a path
 * @param {string} path
 * @param {function} callback - Called with snapshot.val() when data changes
 * @returns {function} Unsubscribe function
 */
function onGameDataChanged(path, callback) {
  const databaseRef = ref(db, path);
  const handler = (snapshot) => callback(snapshot.val());
  onValue(databaseRef, handler);
  // Return unsubscribe function
  return () => {
    databaseRef.off && databaseRef.off("value", handler);
  };
}

// PUBLIC_INTERFACE
/**
 * Push a new object under a path (e.g. "guesses/")
 * @param {string} path
 * @param {object} obj
 * @returns {Promise}
 */
function pushGameData(path, obj) {
  return push(ref(db, path), obj);
}

// PUBLIC_INTERFACE
/**
 * Read data once from a path (no listener)
 * @param {string} path
 * @returns {Promise<object|null>}
 */
function getGameDataOnce(path) {
  return get(child(ref(db), path)).then(snapshot => snapshot.exists() ? snapshot.val() : null);
}

export {
  auth,
  db,
  loginAnonymously,
  signOutUser,
  onAuthChanged,
  setGameData,
  updateGameData,
  onGameDataChanged,
  pushGameData,
  getGameDataOnce
};
