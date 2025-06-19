// Run this script to add initial comments to Firebase
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleComments = [
  {
    name: "Angry Customer",
    comment: "I've been trying to load this webpage for 3 hours! MTN speed is slower than a snail! 🐌",
    likes: 47,
  },
  {
    name: "Frustrated User",
    comment: "They charged me ₦5000 for 1GB and it finished in 10 minutes. SCAM! 😡",
    likes: 89,
  },
  {
    name: "Fed Up Nigerian",
    comment: "Customer service put me on hold for 6 hours then hung up. I'm switching networks! 📞💔",
    likes: 156,
  },
  {
    name: "Broke Student",
    comment: "MTN ate my entire allowance in one day! Now I'm surviving on free WiFi at McDonald's 🍟📱",
    likes: 203,
  },
  {
    name: "Night Shift Worker",
    comment: "Tried to make an emergency call at 2AM. No signal. Thanks MTN for making me walk 5km to find help! 🚶‍♂️",
    likes: 178,
  },
  {
    name: "Tired Parent",
    comment: "My kid's online class got disconnected 5 times in 30 minutes. MTN is sabotaging education! 👨‍🎓📚",
    likes: 134,
  },
]

async function seedComments() {
  console.log("Adding sample comments to Firebase...")

  for (const comment of sampleComments) {
    try {
      await addDoc(collection(db, "comments"), {
        ...comment,
        createdAt: serverTimestamp(),
      })
      console.log(`Added comment by ${comment.name}`)
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  console.log("Finished seeding comments!")
}

seedComments()
