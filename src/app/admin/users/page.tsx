"use client";

import { UserTable } from "@/components/admin/user-manager/user-table";

export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all users in the system
          </p>
        </div>
      </div>
      <UserTable />
    </div>
  );
} 