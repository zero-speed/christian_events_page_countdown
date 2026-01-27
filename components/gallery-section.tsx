"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { galleryItems } from "@/lib/events-data"

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentItem = galleryItems[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section id="comunidad" className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Más sobre Nosotros</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6"></div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Momentos especiales que compartimos juntos en fe y amor
          </p>
        </div>

        {/* Carrusel */}
        <div className="max-w-4xl mx-auto">
          {/* Imagen Principal */}
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden group mb-8">
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className="object-cover"
              priority
            />

            {/* Botones de navegación */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white p-3 rounded-full transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white p-3 rounded-full transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicador de página */}
            <div className="absolute bottom-6 right-6 bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {currentIndex + 1} / {galleryItems.length}
            </div>
          </div>

          {/* Dots de navegación */}
          <div className="flex justify-center gap-3 mb-8">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-amber-500 w-8"
                    : "bg-slate-600 w-3 hover:bg-slate-500"
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Título y descripción del slide actual */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-amber-400 mb-4">{currentItem.title}</h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">{currentItem.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

