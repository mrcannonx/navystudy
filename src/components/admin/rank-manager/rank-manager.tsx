"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface Rank {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  order: number;
}

export function RankManager() {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);
  const [newRankName, setNewRankName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const response = await fetch("/api/admin/ranks");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch ranks");
        }
        const data = await response.json();
        setRanks(data);
      } catch (error) {
        console.error("Error fetching ranks:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch ranks",
          variant: "destructive",
        });
      }
    };

    fetchRanks();
  }, [toast]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const addNewRank = async () => {
    try {
      if (!newRankName.trim()) {
        toast({
          title: "Error",
          description: "Please enter a rank name",
          variant: "destructive",
        });
        return;
      }

      console.log("Creating rank with data:", {
        name: newRankName.trim(),
        description: "",
        order: ranks.length
      });

      // First create the rank
      const createResponse = await fetch("/api/admin/ranks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRankName.trim(),
          description: "",
          order: ranks.length,
        }),
      });

      const responseData = await createResponse.json();
      console.log("Server response:", {
        status: createResponse.status,
        data: responseData
      });

      if (!createResponse.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to create rank");
      }

      const newRank = responseData;
      console.log("Created new rank:", newRank);

      // If there's a selected file, upload it
      if (selectedFile) {
        console.log("Uploading image for rank:", newRank.id);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("rankId", newRank.id);

        const uploadResponse = await fetch("/api/admin/ranks/upload-image", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        console.log("Image upload response:", {
          status: uploadResponse.status,
          data: uploadData
        });

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || uploadData.error || "Failed to upload image");
        }

        const { image_url } = uploadData;
        console.log("Image uploaded successfully:", image_url);
        newRank.image_url = image_url;
      }

      setRanks([...ranks, newRank]);
      setIsOpen(false);
      setNewRankName("");
      setSelectedFile(null);
      
      toast({
        title: "Success",
        description: "New rank created successfully",
      });
    } catch (error) {
      console.error("Error creating rank:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const deleteRank = async (rankId: string) => {
    try {
      const response = await fetch(`/api/admin/ranks/${rankId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete rank");
      }

      setRanks(ranks.filter(rank => rank.id !== rankId));
      toast({
        title: "Success",
        description: "Rank deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting rank:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete rank",
        variant: "destructive",
      });
    }
  };

  const handleEditRank = (rank: Rank) => {
    setEditingRank(rank);
    setNewRankName(rank.name);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const updateRank = async () => {
    if (!editingRank) return;

    try {
      const response = await fetch(`/api/admin/ranks/${editingRank.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRankName.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update rank");
      }

      const updatedRank = await response.json();

      // If there's a selected file, upload it
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("rankId", editingRank.id);

        const uploadResponse = await fetch("/api/admin/ranks/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.message || "Failed to upload image");
        }

        const { image_url } = await uploadResponse.json();
        updatedRank.image_url = image_url;
      }

      setRanks(ranks.map(r => r.id === editingRank.id ? updatedRank : r));
      setIsOpen(false);
      setIsEditMode(false);
      setEditingRank(null);
      setNewRankName("");
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Rank updated successfully",
      });
    } catch (error) {
      console.error("Error updating rank:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update rank",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Ranks</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditMode(false);
                setEditingRank(null);
                setNewRankName("");
                setSelectedFile(null);
              }}
            >
              Add Rank
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Rank" : "Create New Rank"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Update the rank name and image" 
                  : "Create a new rank by entering a name and optionally uploading an image"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rank Name</Label>
                <Input
                  id="name"
                  value={newRankName}
                  onChange={(e) => setNewRankName(e.target.value)}
                  placeholder="Enter rank name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Rank Image</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : "Click to upload rank image"}
                    </div>
                  </label>
                </div>
              </div>
              <Button 
                onClick={isEditMode ? updateRank : addNewRank} 
                className="w-full"
              >
                {isEditMode ? "Update Rank" : "Create Rank"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {ranks.map((rank) => (
          <div key={rank.id} className="bg-white rounded-lg shadow p-2 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-base font-medium">{rank.name}</h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditRank(rank)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRank(rank.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
            {rank.image_url && (
              <div className="relative aspect-square">
                <Image
                  src={rank.image_url}
                  alt={`${rank.name} rank image`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={false}
                  loading="lazy"
                  className="object-contain rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 