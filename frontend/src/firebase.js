import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDbW5G0VNqaabFSMRvEOMiY81RbK3cdtU",
  authDomain: "gen-lang-client-0132833584.firebaseapp.com",
  projectId: "gen-lang-client-0132833584",
  storageBucket: "gen-lang-client-0132833584.firebasestorage.app",
  messagingSenderId: "188989367375",
  appId: "1:188989367375:web:52d527fba4c184a6daf63a",
  measurementId: "G-WVCVBKYR1F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);