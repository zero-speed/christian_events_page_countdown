"use client"

import { useState, useMemo, useEffect } from "react"
import { EventCard } from "@/components/event-card"
import { EventModal } from "@/components/event-modal"
import { HeroSection } from "@/components/hero-section"
import { GallerySection } from "@/components/gallery-section"
import { FooterSection } from "@/components/footer-section"
import { CategoryFilter } from "@/components/category-filter"
import { events } from "@/lib/events-data"
import { Event, TargetAudience } from "@/lib/types"

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TargetAudience | null>(null)
  const [upcomingCount, setUpcomingCount] = useState(0)

  const openModal = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedEvent(null), 300)
  }

  // Update upcoming events count automatically
  useEffect(() => {
    const updateCount = () => {
      const now = new Date()
      const upcoming = events.filter((e) => new Date(e.date) >= now).length
      setUpcomingCount(upcoming)
    }

    updateCount()
    // Actualiza cada minuto
    const interval = setInterval(updateCount, 60000)

    return () => clearInterval(interval)
  }, [])

  // Filter events by category and sort by date, exclude past events
  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date()
    let filtered = events

    // Filter out past events (events that have already ended)
    filtered = filtered.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= now
    })

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((event) => event.targetAudience === selectedCategory)
    }

    // Sort by date (ascending)
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <HeroSection />

      {/* Events Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Próximos Eventos</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
            <p className="text-amber-400 text-lg mt-4 font-semibold">{upcomingCount} eventos próximos</p>
          </div>

          {/* Category Filter */}
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          {filteredAndSortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => openModal(event)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-slate-400">No hay eventos disponibles en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      <GallerySection />

      <FooterSection />

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
