"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Edit2, MessageSquare, BarChart3, Home, X, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { events, aboutData as initialAboutData, galleryItems as initialGalleryItems } from "@/lib/events-data"
import { Event, AboutData, GalleryItem, AdminTab } from "@/lib/types"
import { loadEvents, saveEvents, loadCategories, saveCategories, loadAboutData, saveAboutData, loadGalleryItems, saveGalleryItems, listenToEvents, listenToCategories, listenToAboutData, listenToGalleryItems } from "@/lib/firebase"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [eventList, setEventList] = useState<Event[]>(events)
  const [aboutData, setAboutData] = useState<AboutData>(initialAboutData)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showGalleryForm, setShowGalleryForm] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categories, setCategories] = useState<string[]>(["Jóvenes", "Enseñanza", "Oración"])
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    organizer: "",
    capacity: "",
    gallery: [] as string[],
  })

  // Check authentication and load data from Firebase
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth) {
      const parsed = JSON.parse(auth)
      if (parsed.authenticated) {
        setIsAuthenticated(true)
        // Load data from Firebase with real-time listeners
        loadEventsWithListener()
        loadCategoriesWithListener()
        loadAboutDataWithListener()
        loadGalleryItemsWithListener()
      }
    }
    setIsLoading(false)

    if (!auth || !JSON.parse(auth).authenticated) {
      router.push("/admin/login")
    }
  }, [router])

  const loadEventsWithListener = () => {
    const unsubscribe = listenToEvents((firebaseEvents) => {
      if (firebaseEvents && Array.isArray(firebaseEvents)) {
        setEventList(firebaseEvents)
      }
    })
    // Store unsubscribe for cleanup if needed
    return unsubscribe
  }

  const loadCategoriesWithListener = () => {
    const unsubscribe = listenToCategories((firebaseCategories) => {
      if (firebaseCategories && Array.isArray(firebaseCategories)) {
        setCategories(firebaseCategories)
      }
    })
    return unsubscribe
  }

  const loadAboutDataWithListener = async () => {
    try {
      const firebaseAboutData = await loadAboutData()
      if (firebaseAboutData) {
        setAboutData(firebaseAboutData)
      }
    } catch (error) {
      console.error("Error loading about data:", error)
    }
  }

  const loadGalleryItemsWithListener = async () => {
    try {
      const firebaseGalleryItems = await loadGalleryItems()
      if (firebaseGalleryItems && Array.isArray(firebaseGalleryItems)) {
        setGalleryItems(firebaseGalleryItems)
      }
    } catch (error) {
      console.error("Error loading gallery items:", error)
    }
  }

  const loadEventsFromFirebase = async () => {
    try {
      const firebaseEvents = await loadEvents()
      if (firebaseEvents && Array.isArray(firebaseEvents)) {
        setEventList(firebaseEvents)
      }
    } catch (error) {
      console.error("Error loading events from Firebase:", error)
    }
  }

  const loadCategoriesFromFirebase = async () => {
    try {
      const firebaseCategories = await loadCategories()
      if (firebaseCategories && Array.isArray(firebaseCategories)) {
        setCategories(firebaseCategories)
      }
    } catch (error) {
      console.error("Error loading categories from Firebase:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/")
  }

  // Calculate statistics
  const totalEvents = eventList.length
  const totalConfirmations = eventList.reduce((sum, event) => sum + (event.confirmations || 0), 0)
  const totalComments = eventList.reduce((sum, event) => sum + (event.comments?.length || 0), 0)
  const upcomingEvents = eventList.filter((e) => new Date(e.date) >= new Date()).length

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result as string
          setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, result],
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const handleAddEvent = () => {
    if (formData.title && formData.date) {
      const newEvent: Event = {
        id: Math.max(...eventList.map((e) => e.id), 0) + 1,
        ...formData,
        confirmations: 0,
        comments: [],
      }
      const updatedList = [...eventList, newEvent]
      setEventList(updatedList)
      saveEvents(updatedList)
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "",
        organizer: "",
        capacity: "",
        gallery: [],
      })
      setShowEventForm(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      organizer: event.organizer || "",
      capacity: event.capacity || "",
      gallery: event.gallery || [],
    })
    setShowEventForm(true)
  }

  const handleUpdateEvent = () => {
    if (editingEvent && formData.title && formData.date) {
      const updatedList = eventList.map((e) =>
        e.id === editingEvent.id
          ? {
              ...e,
              ...formData,
            }
          : e
      )
      setEventList(updatedList)
      saveEvents(updatedList)
      setEditingEvent(null)
      handleResetForm()
    }
  }

  const handleResetForm = () => {
    setEditingEvent(null)
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      category: "",
      organizer: "",
      capacity: "",
      gallery: [],
    })
    setShowEventForm(false)
  }

  const handleDeleteEvent = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      const updatedList = eventList.filter((e) => e.id !== id)
      setEventList(updatedList)
      saveEvents(updatedList)
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName)) {
      const updatedCategories = [...categories, newCategoryName]
      setCategories(updatedCategories)
      saveCategories(updatedCategories)
      setNewCategoryName("")
      setShowNewCategoryModal(false)
    }
  }

  const handleDeleteComment = (eventId: number, commentId: number) => {
    if (confirm("¿Eliminar este comentario?")) {
      setEventList(
        eventList.map((e) =>
          e.id === eventId
            ? {
                ...e,
                comments: e.comments?.filter((c) => c.id !== commentId) || [],
              }
            : e
        )
      )
    }
  }

  const handleUpdateAbout = () => {
    saveAboutData(aboutData)
    alert("Información actualizada correctamente")
  }

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item)
    setShowGalleryForm(true)
  }

  const handleUpdateGalleryItem = (itemId: number, updatedTitle: string, updatedDescription: string) => {
    const updated = galleryItems.map((item) =>
      item.id === itemId
        ? { ...item, title: updatedTitle, description: updatedDescription }
        : item
    )
    setGalleryItems(updated)
    saveGalleryItems(updated)
    setEditingGalleryItem(null)
    setShowGalleryForm(false)
  }

  const handleResetGalleryForm = () => {
    setEditingGalleryItem(null)
    setShowGalleryForm(false)
  }

  const handleDeleteGalleryItem = (itemId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta galería?")) {
      const updated = galleryItems.filter((item) => item.id !== itemId)
      setGalleryItems(updated)
      saveGalleryItems(updated)
    }
  }

  const handleAddGalleryItem = (newImage: string, newTitle: string, newDescription: string) => {
    if (newImage && newTitle && newDescription) {
      const newItem: GalleryItem = {
        id: Math.max(...galleryItems.map((item) => item.id), 0) + 1,
        image: newImage,
        title: newTitle,
        description: newDescription,
      }
      const updated = [...galleryItems, newItem]
      setGalleryItems(updated)
      saveGalleryItems(updated)
      setShowGalleryForm(false)
      alert("Galería agregada correctamente")
    } else {
      alert("Por favor completa todos los campos")
    }
  }

  // Modal para nueva categoría
  const NewCategoryModal = () => (
    showNewCategoryModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-xl font-bold text-white mb-4">Nueva Categoría</h3>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddCategory}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Crear
            </button>
            <button
              onClick={() => {
                setShowNewCategoryModal(false)
                setNewCategoryName("")
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold">⚙️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Administración</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Volver
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-4 px-6 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`py-4 px-6 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "events"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-4 px-6 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "comments"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Comentarios
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`py-4 px-6 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "about"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Sobre Nosotros
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`py-4 px-6 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "gallery"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Galería
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="text-slate-400 text-sm uppercase mb-2">Total Eventos</div>
                <div className="text-4xl font-bold text-amber-400">{totalEvents}</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="text-slate-400 text-sm uppercase mb-2">Próximos</div>
                <div className="text-4xl font-bold text-green-400">{upcomingEvents}</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="text-slate-400 text-sm uppercase mb-2">Confirmaciones</div>
                <div className="text-4xl font-bold text-blue-400">{totalConfirmations}</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="text-slate-400 text-sm uppercase mb-2">Comentarios</div>
                <div className="text-4xl font-bold text-purple-400">{totalComments}</div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Próximos 5 Eventos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-300">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="pb-3 text-amber-400">Evento</th>
                      <th className="pb-3 text-amber-400">Fecha</th>
                      <th className="pb-3 text-amber-400">Confirmados</th>
                      <th className="pb-3 text-amber-400">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventList
                      .filter((e) => new Date(e.date) >= new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 5)
                      .map((event) => (
                        <tr key={event.id} className="border-b border-slate-700 hover:bg-slate-700/20">
                          <td className="py-3">{event.title}</td>
                          <td className="py-3">{event.date}</td>
                          <td className="py-3 text-green-400">{event.confirmations || 0}</td>
                          <td className="py-3 text-purple-400">{event.comments?.length || 0}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Gestión de Eventos</h2>
              <button
                onClick={() => {
                  setEditingEvent(null)
                  setFormData({
                    title: "",
                    date: "",
                    time: "",
                    location: "",
                    description: "",
                    category: "",
                    organizer: "",
                    capacity: "",
                    gallery: [],
                  })
                  setShowEventForm(!showEventForm)
                }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Evento
              </button>
            </div>

            {/* Event Form */}
            {showEventForm && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Título"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Ubicación"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                    >
                      <option value="">Seleccionar Categoría</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowNewCategoryModal(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Organizador"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Capacidad"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg mb-4"
                />

                {/* Image Upload Section */}
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Imágenes del Evento</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                  
                  {/* Image Preview */}
                  {formData.gallery.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.gallery.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-600"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingEvent ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="space-y-4">
              {eventList
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((event) => (
                  <div key={event.id} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white">{event.title}</h4>
                        <p className="text-slate-400 text-sm">
                          {event.date} | {event.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-slate-400">
                        <span className="text-amber-400 font-bold">{event.confirmations || 0}</span> confirmados
                      </div>
                      <div className="text-slate-400">
                        <span className="text-purple-400 font-bold">{event.comments?.length || 0}</span> comentarios
                      </div>
                      <div className="text-slate-400">
                        <span className="font-bold text-emerald-400">{event.targetAudience}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Gestión de Comentarios</h2>
            <div className="space-y-6">
              {eventList
                .filter((e) => (e.comments?.length || 0) > 0)
                .map((event) => (
                  <div key={event.id} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-amber-400 mb-4">{event.title}</h4>
                    <div className="space-y-3">
                      {event.comments?.map((comment) => (
                        <div key={comment.id} className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-semibold">{comment.author}</p>
                              <p className="text-slate-400 text-sm">{comment.date}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteComment(event.id, comment.id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-slate-300">{comment.text}</p>
                          <div className="mt-2 text-sm text-slate-400">
                            ❤️ {comment.likes || 0} likes
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              {eventList.every((e) => (e.comments?.length || 0) === 0) && (
                <p className="text-slate-400 text-center py-12">No hay comentarios aún</p>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Editar Sobre Nosotros</h2>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 max-w-2xl">
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Título</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-8">
                <label className="block text-white font-semibold mb-2">Descripción</label>
                <textarea
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-amber-500 h-32"
                />
              </div>

              {/* Preview */}
              <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
                <h4 className="text-white font-semibold mb-3">Previsualización</h4>
                <h3 className="text-2xl font-bold text-amber-400 mb-2">{aboutData.title}</h3>
                <p className="text-slate-300">{aboutData.subtitle}</p>
              </div>

              <button
                onClick={handleUpdateAbout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Editar Galería</h2>
              <button
                onClick={() => {
                  setEditingGalleryItem(null)
                  setShowGalleryForm(!showGalleryForm)
                }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Agregar Galería
              </button>
            </div>

            {/* Formulario para agregar nueva galería */}
            {showGalleryForm && !editingGalleryItem && (
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Nueva Galería</h3>
                  <button
                    onClick={() => setShowGalleryForm(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* URL de imagen */}
                  <div>
                    <label className="block text-white font-semibold mb-2">URL de la Imagen</label>
                    <input
                      type="text"
                      id="new-image-url"
                      placeholder="Ej: /.jpg?height=800&width=600&query=church+worship"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-slate-400 text-sm mt-2">O sube una imagen:</p>
                    <input
                      type="file"
                      accept="image/*"
                      id="new-gallery-image"
                      className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded mt-2 file:bg-amber-500 file:text-slate-900 file:font-bold file:px-4 file:py-2 file:rounded file:border-0 file:cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const urlInput = document.getElementById(
                              "new-image-url"
                            ) as HTMLInputElement
                            if (urlInput) {
                              urlInput.value = event.target?.result as string
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>

                  {/* Título */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Título</label>
                    <input
                      type="text"
                      id="new-gallery-title"
                      placeholder="Ej: Adoración"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Descripción</label>
                    <textarea
                      id="new-gallery-description"
                      placeholder="Describe esta sección de la galería..."
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 h-24"
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const imageUrl = (
                          document.getElementById("new-image-url") as HTMLInputElement
                        )?.value
                        const title = (
                          document.getElementById("new-gallery-title") as HTMLInputElement
                        )?.value
                        const description = (
                          document.getElementById("new-gallery-description") as HTMLTextAreaElement
                        )?.value

                        if (imageUrl && title && description) {
                          handleAddGalleryItem(imageUrl, title, description)
                          // Limpiar formulario
                          ;(document.getElementById("new-image-url") as HTMLInputElement).value =
                            ""
                          ;(document.getElementById("new-gallery-title") as HTMLInputElement).value =
                            ""
                          ;(
                            document.getElementById("new-gallery-description") as HTMLTextAreaElement
                          ).value = ""
                        } else {
                          alert("Por favor completa todos los campos")
                        }
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Agregar
                    </button>
                    <button
                      onClick={() => {
                        setShowGalleryForm(false)
                        ;(document.getElementById("new-image-url") as HTMLInputElement).value =
                          ""
                        ;(document.getElementById("new-gallery-title") as HTMLInputElement).value =
                          ""
                        ;(
                          document.getElementById("new-gallery-description") as HTMLTextAreaElement
                        ).value = ""
                      }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de galerías */}
            <div className="space-y-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                  <div className="grid md:grid-cols-3 gap-6 items-start">
                    {/* Preview de imagen */}
                    <div className="md:col-span-1">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    {/* Contenido editable */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-amber-400 mb-4">{item.title}</h3>
                      <p className="text-slate-300 mb-4">{item.description}</p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditGalleryItem(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de edición */}
                  {editingGalleryItem?.id === item.id && showGalleryForm && (
                    <div className="mt-6 pt-6 border-t border-slate-600">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">Título</label>
                          <input
                            type="text"
                            defaultValue={item.title}
                            id={`title-${item.id}`}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2">Descripción</label>
                          <textarea
                            defaultValue={item.description}
                            id={`description-${item.id}`}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-amber-500 h-24"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              const titleInput = (
                                document.getElementById(`title-${item.id}`) as HTMLInputElement
                              )?.value
                              const descriptionInput = (
                                document.getElementById(`description-${item.id}`) as HTMLTextAreaElement
                              )?.value
                              handleUpdateGalleryItem(item.id, titleInput, descriptionInput)
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleResetGalleryForm}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NewCategoryModal />
    </div>
  )
}
