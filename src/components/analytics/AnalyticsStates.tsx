import { Card } from "@/components/ui/card"

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg animate-pulse bg-muted">
              <div className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-6 w-16 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 col-span-full">
        <div className="flex items-center justify-center h-24 text-red-500">
          Error loading analytics: {error}
        </div>
      </Card>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 col-span-full">
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          No analytics data available
        </div>
      </Card>
    </div>
  )
}
