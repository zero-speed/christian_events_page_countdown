import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get, child, onValue } from "firebase/database"

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

// Real-time listener for events
export function listenToEvents(callback: (events: any[]) => void) {
  const eventsRef = ref(database, "events")
  
  const unsubscribe = onValue(
    eventsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      }
    },
    (error) => {
      console.error("Error listening to events:", error)
    }
  )

  return unsubscribe
}

// Real-time listener for categories
export function listenToCategories(callback: (categories: string[]) => void) {
  const categoriesRef = ref(database, "categories")
  
  const unsubscribe = onValue(
    categoriesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      }
    },
    (error) => {
      console.error("Error listening to categories:", error)
    }
  )

  return unsubscribe
}

// Save and load About Data
export async function saveAboutData(aboutData: any) {
  try {
    await set(ref(database, "aboutData"), aboutData)
    return true
  } catch (error) {
    console.error("Error saving about data:", error)
    return false
  }
}

export async function loadAboutData() {
  try {
    const snapshot = await get(child(ref(database), "aboutData"))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error("Error loading about data:", error)
    return null
  }
}

export function listenToAboutData(callback: (aboutData: any) => void) {
  const aboutRef = ref(database, "aboutData")
  
  const unsubscribe = onValue(
    aboutRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      }
    },
    (error) => {
      console.error("Error listening to about data:", error)
    }
  )

  return unsubscribe
}

// Save and load Gallery Items
export async function saveGalleryItems(galleryItems: any[]) {
  try {
    await set(ref(database, "galleryItems"), galleryItems)
    return true
  } catch (error) {
    console.error("Error saving gallery items:", error)
    return false
  }
}

export async function loadGalleryItems() {
  try {
    const snapshot = await get(child(ref(database), "galleryItems"))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error("Error loading gallery items:", error)
    return null
  }
}

export function listenToGalleryItems(callback: (galleryItems: any[]) => void) {
  const galleryRef = ref(database, "galleryItems")
  
  const unsubscribe = onValue(
    galleryRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      }
    },
    (error) => {
      console.error("Error listening to gallery items:", error)
    }
  )

  return unsubscribe
}
