import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARckkRqgS5P13Ar6WmMKOEuiG8emyQ5lQ",
  authDomain: "agrisage-commerce.firebaseapp.com",
  projectId: "agrisage-commerce",
  storageBucket: "agrisage-commerce.firebasestorage.app",
  messagingSenderId: "134494144677",
  appId: "1:134494144677:web:132fd548b18bf70aab254c",
  measurementId: "G-Y54T8B9CH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);