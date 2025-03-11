interface ErrorDisplayProps {
  message: string | null
  className?: string
}

export function ErrorDisplay({ message, className = '' }: ErrorDisplayProps) {
  if (!message) return null

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] space-y-4 ${className}`}>
      <div className="text-red-500 text-center">
        <p className="text-lg font-semibold">Error</p>
        <p>{message}</p>
      </div>
    </div>
  )
}
