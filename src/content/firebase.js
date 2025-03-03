import firebaseConfig from "./config.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };