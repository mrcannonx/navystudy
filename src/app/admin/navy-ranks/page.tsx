"use client"

import { NavyRankManager } from "@/components/admin/navy-rank-manager"

export default function NavyRankManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Navy Rank Management</h1>
        <p className="text-muted-foreground">
          Manage navy ranks for enlisted personnel (E4-E7)
        </p>
      </div>

      <NavyRankManager />
    </div>
  )
}