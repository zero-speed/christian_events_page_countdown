"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
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
}

interface EventCardProps {
  event: Event
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(event.date + " " + event.time)
      const now = new Date()
      const difference = eventDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)

    return () => clearInterval(timer)
  }, [event.date, event.time])

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.gallery[0] || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
          {event.title}
        </h3>

        {/* Countdown Timer */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">{timeLeft.days}</div>
            <div className="text-xs text-slate-400 uppercase">Días</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">{timeLeft.hours}</div>
            <div className="text-xs text-slate-400 uppercase">Horas</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">{timeLeft.minutes}</div>
            <div className="text-xs text-slate-400 uppercase">Min</div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center text-slate-300">
            <Calendar className="w-5 h-5 mr-3 text-amber-400" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center text-slate-300">
            <Clock className="w-5 h-5 mr-3 text-amber-400" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-slate-300">
            <MapPin className="w-5 h-5 mr-3 text-amber-400" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        {/* Click to view more */}
        <div className="mt-6 text-center">
          <span className="text-amber-400 text-sm font-semibold group-hover:underline">Ver detalles →</span>
        </div>
      </div>
    </div>
  )
}
