"use client"

import { InsigniaManager } from "@/components/admin/insignia-manager"

export default function InsigniaManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insignia Management</h1>
        <p className="text-muted-foreground">
          Manage rank insignias for all Navy ranks
        </p>
      </div>

      <InsigniaManager />
    </div>
  )
} 