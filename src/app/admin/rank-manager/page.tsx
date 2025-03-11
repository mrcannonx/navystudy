import { Metadata } from "next";
import { RankManager } from "@/components/admin/rank-manager/rank-manager";

export const metadata: Metadata = {
  title: "Rank Manager | Admin",
  description: "Manage rank badges and images",
};

export default function RankManagerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Rank Manager</h1>
      <RankManager />
    </div>
  );
} 