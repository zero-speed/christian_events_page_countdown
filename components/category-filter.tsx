"use client"

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

const categories: { label: string; value: string }[] = [
  { label: "Jóvenes", value: "Jóvenes" },
  { label: "Enseñanza", value: "Enseñanza" },
  { label: "Oración", value: "Oración" },
  { label: "Jovenes", value: "Jovenes" },
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
