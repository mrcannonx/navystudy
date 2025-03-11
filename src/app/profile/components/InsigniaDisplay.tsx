"use client"

import Image from "next/image"

interface InsigniaDisplayProps {
  title: string
  imageUrl: string | null
  altText: string
  isLoading: boolean
}

export function InsigniaDisplay({
  title,
  imageUrl,
  altText,
  isLoading
}: InsigniaDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</p>
      <div className="group relative w-36 h-36 bg-white dark:bg-white rounded-xl p-4 flex items-center justify-center border border-gray-200 dark:border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Pure white background in both light and dark modes */}
        
        {imageUrl ? (
          <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-contain"
              sizes="144px"
              priority
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg w-full">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <span>Not available</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}