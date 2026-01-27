"use client"

import { useEffect, useState } from "react"
import { events } from "@/lib/events-data"
import { AboutData } from "@/lib/types"

interface HeroSectionProps {
  aboutData?: AboutData
}

export function HeroSection({ aboutData }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const activeMembers = 221
  const totalEvents = events.length

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToCommunity = () => {
    const communitySection = document.getElementById("comunidad")
    if (communitySection) {
      communitySection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=1080&width=1920&query=church+worship+community+gathering+warm+light)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="mb-8">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-2 mb-6">
            <span className="text-amber-400 font-semibold">Bienvenidos a Nuestro mural digital</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent animate-shimmer">
            Unidos en Fe
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          {aboutData?.subtitle || "Descubre los próximos eventos de nuestra Iglesia cristiana Metodista - Cusco y únete a nosotros en adoración, aprendizaje y compañerismo"}
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12 max-w-2xl mx-auto">
          <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6">
            <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{activeMembers.toLocaleString()}</div>
            <div className="text-slate-300 text-sm md:text-base">Miembros Activos en el Distrito</div>
          </div>
          <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6">
            <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{totalEvents}</div>
            <div className="text-slate-300 text-sm md:text-base">Eventos Próximos</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={scrollToCommunity}
            className="bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold px-8 py-4 rounded-lg border border-slate-700 hover:border-amber-500/50 transition-all duration-300"
          >
            Conocer Más
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
