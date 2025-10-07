"use client"

import { useState } from "react"
import { EventCard } from "@/components/event-card"
import { EventModal } from "@/components/event-modal"
import { HeroSection } from "@/components/hero-section"
import { GallerySection } from "@/components/gallery-section"
import { FooterSection } from "@/components/footer-section"
import { events } from "@/lib/events-data"

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (event: (typeof events)[0]) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedEvent(null), 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <HeroSection />

      {/* Events Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Próximos Eventos</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => openModal(event)} />
            ))}
          </div>
        </div>
      </section>

      <GallerySection />

      <FooterSection />

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
