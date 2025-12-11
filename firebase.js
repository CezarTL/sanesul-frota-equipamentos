// js/firebase.js (ES Module)
import { firebaseConfig } from '../firebase-config.js';

export async function initFirebase(){
  if(window.firebaseApp) return;
  await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
  await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
  await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js');
  window.firebaseApp = firebase.initializeApp(firebaseConfig);
  window.firebaseAuth = firebase.auth();
  window.firebaseDB = firebase.firestore();
  return;
}
