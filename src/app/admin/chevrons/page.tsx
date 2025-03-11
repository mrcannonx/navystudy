"use client"

import { NavyRankManager } from "@/components/admin/chevron-manager"

export default function ChevronManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chevron Management</h1>
        <p className="text-muted-foreground">
          Manage chevrons for enlisted ranks (E4-E7)
        </p>
      </div>

      <NavyRankManager />
    </div>
  )
} 