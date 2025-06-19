import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCOEqY2Z7dKdblyud8SL6IoOmTOo-nWUPE",
  authDomain: "troll-mtn.firebaseapp.com",
  projectId: "troll-mtn",
  storageBucket: "troll-mtn.firebasestorage.app",
  messagingSenderId: "447486665826",
  appId: "1:447486665826:web:7748992a28f4d134c09d3b",
  measurementId: "G-T9VNPXYS8K"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export interface Comment {
  id: string
  name: string
  comment: string
  likes: number
  createdAt: Date
  timestamp?: string
}
