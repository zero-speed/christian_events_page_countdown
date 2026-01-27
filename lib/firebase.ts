import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get, child } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCy_e80lK6DNOqf3QSRjeMU-qChvx_Xi2k",
  authDomain: "juventud-metodista.firebaseapp.com",
  projectId: "juventud-metodista",
  storageBucket: "juventud-metodista.firebasestorage.app",
  messagingSenderId: "646339198021",
  appId: "1:646339198021:web:744202f89520846318772c",
  measurementId: "G-6ZVL0VSBS1",
  databaseURL: "https://juventud-metodista-default-rtdb.firebaseio.com"
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)

export async function saveEvents(events: any[]) {
  try {
    await set(ref(database, "events"), events)
    return true
  } catch (error) {
    console.error("Error saving events:", error)
    return false
  }
}

export async function loadEvents() {
  try {
    const snapshot = await get(child(ref(database), "events"))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error("Error loading events:", error)
    return null
  }
}

export async function saveCategories(categories: string[]) {
  try {
    await set(ref(database, "categories"), categories)
    return true
  } catch (error) {
    console.error("Error saving categories:", error)
    return false
  }
}

export async function loadCategories() {
  try {
    const snapshot = await get(child(ref(database), "categories"))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error("Error loading categories:", error)
    return null
  }
}
