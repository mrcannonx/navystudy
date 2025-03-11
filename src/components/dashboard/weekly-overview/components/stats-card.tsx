import React from "react";
import { Card } from "@/components/ui/card";
import { StatCardProps } from "../types";

export const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconBgColor,
  iconColor,
  extraContent
}) => {
  return (
    <Card className={`p-4 border ${bgColor} rounded-lg`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`p-2 ${iconBgColor} rounded-md`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              {extraContent && (
                <div className="ml-2">
                  {extraContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};