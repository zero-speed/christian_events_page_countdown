"use client"

import { useEffect, useState } from "react"
import { listenToCategories } from "@/lib/firebase"

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>(["Jóvenes", "Enseñanza", "Oración"])

  useEffect(() => {
    const unsubscribe = listenToCategories((firebaseCategories) => {
      if (firebaseCategories && Array.isArray(firebaseCategories)) {
        setCategories(firebaseCategories)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
          selectedCategory === null
            ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50"
            : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-500/50 hover:text-white"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 capitalize ${
            selectedCategory === category
              ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50"
              : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-500/50 hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

