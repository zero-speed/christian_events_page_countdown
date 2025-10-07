"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const galleryImages = [
  { id: 1, query: "church+worship+praise+hands+raised", alt: "Adoración" },
  { id: 2, query: "bible+study+group+community", alt: "Estudio Bíblico" },
  { id: 3, query: "youth+group+christian+fellowship", alt: "Jóvenes" },
  { id: 4, query: "church+prayer+circle+community", alt: "Oración" },
  { id: 5, query: "christian+family+event+celebration", alt: "Familia" },
  { id: 6, query: "church+choir+singing+worship", alt: "Coro" },
]

export function GallerySection() {
  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            galleryImages.forEach((img, index) => {
              setTimeout(() => {
                setVisibleImages((prev) => [...prev, img.id])
              }, index * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="comunidad" className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Mas sobre Nosotros</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6"></div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Momentos especiales que compartimos juntos en fe y amor
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className={`relative h-64 rounded-xl overflow-hidden group transition-all duration-700 ${
                visibleImages.includes(image.id) ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <Image
                src={`/.jpg?height=400&width=400&query=${image.query}`}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white font-semibold">{image.alt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
