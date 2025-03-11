import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Weekly Progress Loading */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Retention Rate Loading */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Review Efficiency Loading */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Stats Cards Loading */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 border border-gray-200 bg-gray-100 rounded-lg h-24"></div>
        <div className="p-4 border border-gray-200 bg-gray-100 rounded-lg h-24"></div>
      </div>
    </div>
  );
};