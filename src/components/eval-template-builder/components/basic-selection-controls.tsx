"use client"

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileEdit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  rankOptions,
  ratingOptions,
  evalTypeOptions,
} from '../template-data';

interface BasicSelectionControlsProps {
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  onRankChangeAction: (rank: string) => void;
  onRatingChangeAction: (rating: string) => void;
  onRoleChangeAction: (role: string) => void;
  onEvalTypeChangeAction: (evalType: string) => void;
}

export const BasicSelectionControls: React.FC<BasicSelectionControlsProps> = ({
  rank,
  rating,
  role,
  evalType,
  onRankChangeAction: originalRankChangeAction,
  onRatingChangeAction: originalRatingChangeAction,
  onRoleChangeAction,
  onEvalTypeChangeAction
}) => {
  // Wrapper functions to handle "none" values
  const onRankChangeAction = (value: string) => {
    // Convert "none" to empty string for the parent component
    originalRankChangeAction(value === "none" ? "" : value);
  };

  const onRatingChangeAction = (value: string) => {
    // Convert "none" to empty string for the parent component
    originalRatingChangeAction(value === "none" ? "" : value);
  };

  // Handle role input change
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("BasicSelectionControls - handleRoleChange called with:", value);
    console.log("BasicSelectionControls - Event details:", {
      type: e.type,
      target: e.target.id,
      nativeEvent: e.nativeEvent.type,
      isTrusted: e.nativeEvent.isTrusted
    });
    onRoleChangeAction(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
      <div className="space-y-2">
        <Label htmlFor="rank-select" className="text-sm font-medium">Rank/Rate</Label>
        <Select value={rank || "none"} onValueChange={onRankChangeAction}>
          <SelectTrigger id="rank-select" className="w-full">
            <SelectValue placeholder="Select rank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="blank-rank" value="none">-- Select Rank --</SelectItem>
            {rankOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rating-select" className="text-sm font-medium">Rating</Label>
        <Select value={rating || "none"} onValueChange={onRatingChangeAction}>
          <SelectTrigger id="rating-select" className="w-full">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="blank-rating" value="none">-- Select Rating --</SelectItem>
            {ratingOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role-input" className="text-sm font-medium">Role/Billet</Label>
        <div className="relative">
          <Input
            id="role-input"
            className="w-full pl-8 transition-all duration-200"
            placeholder="Enter role/billet"
            value={role}
            onChange={handleRoleChange}
            onKeyDown={(e) => console.log("Role input keyDown event:", e.key)}
            onInput={(e) => console.log("Role input onInput event:", (e.target as HTMLInputElement).value)}
          />
          <FileEdit className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eval-type-select" className="text-sm font-medium">Eval Type</Label>
        <Select value={evalType} onValueChange={onEvalTypeChangeAction}>
          <SelectTrigger id="eval-type-select" className="w-full">
            <SelectValue placeholder="Select eval type" />
          </SelectTrigger>
          <SelectContent>
            {evalTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};