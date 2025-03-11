"use client"

import { ReactNode } from 'react'

interface StudyModeCardProps {
  title: string
  description: string
  icon: ReactNode
  features: string[]
  isSelected: boolean
  cardsPerSession: number
  onCardsPerSessionChange: (value: number) => void
  onSelect: () => void
}

export function StudyModeCard({
  title,
  description,
  icon,
  features,
  isSelected,
  cardsPerSession,
  onCardsPerSessionChange,
  onSelect
}: StudyModeCardProps) {
  return (
    <div 
      className={`p-4 rounded-lg border ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      } cursor-pointer`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`text-2xl ${isSelected ? 'text-blue-500' : 'text-gray-600'}`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Cards per Session
          <input
            type="number"
            min={1}
            max={100}
            value={cardsPerSession}
            onChange={(e) => onCardsPerSessionChange(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </label>
      </div>
    </div>
  )
}
