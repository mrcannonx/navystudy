import { LoadingState } from "@/components/ui/loading-state"

export default function Loading() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <LoadingState 
        text="Loading..."
        size="lg"
      />
    </div>
  )
}