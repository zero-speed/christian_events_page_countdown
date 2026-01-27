"use client"

import { TargetAudience } from "@/lib/types"

interface CategoryFilterProps {
  selectedCategory: TargetAudience | null
  onCategoryChange: (category: TargetAudience | null) => void
}

const categories: { label: string; value: TargetAudience }[] = [
  { label: "Niños", value: "niños" },
  { label: "Jóvenes", value: "jóvenes" },
  { label: "Todos", value: "todos" },
  { label: "Mujeres", value: "mujeres" },
  { label: "Varones", value: "varones" },
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
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
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 capitalize ${
            selectedCategory === category.value
              ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50"
              : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-500/50 hover:text-white"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
