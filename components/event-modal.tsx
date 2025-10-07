"use client"

import { useEffect, useState } from "react"
import { X, Calendar, Clock, MapPin, Users } from "lucide-react"
import Image from "next/image"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  gallery: string[]
  category: string
  organizer?: string
  capacity?: string
}

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    // Reset index when a new event is selected or modal opens
    setCurrentImageIndex(0)

    if (isOpen && event && event.gallery.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % event.gallery.length)
      }, 3000) // Change every 3 seconds

      return () => clearInterval(timer)
    }
  }, [isOpen, event])

  if (!event) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full p-2 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Carousel */}
        <div className="relative h-80 overflow-hidden rounded-t-2xl">
          {event.gallery.map((imageSrc, index) => (
            <Image
              key={imageSrc}
              src={imageSrc || "/placeholder.svg"}
              alt={`${event.title} - image ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Navigation Dots */}
          {event.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {event.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-semibold">
            {event.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-4xl font-bold text-white mb-6">{event.title}</h2>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Calendar className="w-6 h-6 mr-3 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Fecha</div>
                <div className="text-white font-semibold">{event.date}</div>
              </div>
            </div>
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Clock className="w-6 h-6 mr-3 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Hora</div>
                <div className="text-white font-semibold">{event.time}</div>
              </div>
            </div>
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <MapPin className="w-6 h-6 mr-3 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Ubicación</div>
                <div className="text-white font-semibold">{event.location}</div>
              </div>
            </div>
            {event.capacity && (
              <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <Users className="w-6 h-6 mr-3 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400 uppercase">Capacidad</div>
                  <div className="text-white font-semibold">{event.capacity}</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Descripción</h3>
            <p className="text-slate-300 leading-relaxed">{event.description}</p>
          </div>

          {event.organizer && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Organizador</h3>
              <p className="text-slate-300">{event.organizer}</p>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
            Confirmar Asistencia
          </button>
        </div>
      </div>
    </div>
  )
}
