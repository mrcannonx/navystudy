"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminButton } from "./admin-button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  UserCog,
  Mail,
  Calendar,
  Star,
  Clock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth";

interface User {
  id: string;
  name: string;
  email: string;
  rank: string;
  rate: number | string;
  signUpDate: string;
  lastActive: string;
  status: "active" | "inactive" | "suspended";
  studyStreak: number;
  totalStudyHours: number;
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({ key: "signUpDate", direction: "desc" });
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Check if user is admin
        if (!profile?.is_admin) {
          toast({
            title: "Error",
            description: "You must be an admin to view this page",
            variant: "destructive",
          });
          return;
        }

        // Fetch all profiles directly using Supabase client
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select('id, created_at, updated_at, username, full_name, avatar_url, bio, preferences, rate, duty_station, years_of_service, specializations, awards, is_admin, navy_rank_id');
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }

        // Fetch navy ranks to map navy_rank_id to rank codes
        const { data: navyRanks, error: navyRanksError } = await supabase
          .from("navy_ranks")
          .select('id, rank_code');
          
        if (navyRanksError) {
          console.error("Error fetching navy ranks:", navyRanksError);
          throw navyRanksError;
        }
        
        // Create a mapping of navy_rank_id to rank_code
        const rankMap = new Map();
        navyRanks?.forEach(rank => {
          rankMap.set(rank.id, rank.rank_code);
        });

        // Transform profiles into the required format
        const transformedUsers: User[] = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.full_name || profile.username || "Anonymous",
          email: profile.username,
          rank: profile.navy_rank_id ? rankMap.get(profile.navy_rank_id) || "Unranked" : "Unranked",
          rate: profile.rate || "N/A",
          signUpDate: profile.created_at,
          lastActive: profile.updated_at,
          status: profile.updated_at
            ? new Date(profile.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ? "active" as const
              : "inactive" as const
            : "inactive" as const,
          studyStreak: 0,
          totalStudyHours: 0
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [toast, profile]);

  const handleSort = (key: keyof User) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filteredAndSortedUsers = [...users]
    .filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-yellow-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <AdminButton variant="outline">Export Data</AdminButton>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>
                <AdminButton
                  variant="ghost"
                  onClick={() => handleSort("rank")}
                  className="flex items-center gap-1"
                >
                  Rank
                  <ArrowUpDown className="h-4 w-4" />
                </AdminButton>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <AdminButton
                  variant="ghost"
                  onClick={() => handleSort("rate")}
                  className="flex items-center gap-1"
                >
                  Rate
                  <ArrowUpDown className="h-4 w-4" />
                </AdminButton>
              </TableHead>
              <TableHead>
                <AdminButton
                  variant="ghost"
                  onClick={() => handleSort("signUpDate")}
                  className="flex items-center gap-1"
                >
                  Sign Up Date
                  <ArrowUpDown className="h-4 w-4" />
                </AdminButton>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.rank}</Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.rate}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {format(new Date(user.signUpDate), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    />
                    {user.status}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <AdminButton variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </AdminButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 