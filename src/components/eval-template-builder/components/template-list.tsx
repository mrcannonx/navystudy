"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, FileText, Calendar } from 'lucide-react'
import { Template } from '../hooks/useTemplates'
import Link from 'next/link'

interface TemplateListProps {
  templates: Template[]
  loading: boolean
  onCreateTemplateAction: () => void
  onEditTemplateAction: (template: Template) => void
  onDeleteTemplateAction: (id: string) => void
}

export function TemplateList({
  templates,
  loading,
  onCreateTemplateAction,
  onEditTemplateAction,
  onDeleteTemplateAction
}: TemplateListProps) {
  // Ensure templates is an array
  const templateList = Array.isArray(templates) ? templates : [];
  
  // Color classes for template cards
  const getColorClass = (index: number) => {
    const colors = [
      {
        accent: "after:bg-blue-500",
        gradient: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900",
        border: "border-blue-200 dark:border-blue-800",
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
      },
      {
        accent: "after:bg-purple-500",
        gradient: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900",
        border: "border-purple-200 dark:border-purple-800",
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
      },
      {
        accent: "after:bg-green-500",
        gradient: "bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900",
        border: "border-green-200 dark:border-green-800",
        icon: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
      },
      {
        accent: "after:bg-orange-500",
        gradient: "bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900",
        border: "border-orange-200 dark:border-orange-800",
        icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300"
      }
    ];
    
    return colors[index % colors.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateList.map((template, index) => {
          const colorClass = getColorClass(index);
          
          return (
            <Card 
              key={template.id} 
              className={`relative overflow-hidden ${colorClass.gradient} ${colorClass.border} shadow-sm hover:shadow transition-all duration-300 hover:translate-y-[-2px] after:absolute after:top-0 after:left-0 after:w-full after:h-1 ${colorClass.accent} after:rounded-t-lg`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colorClass.icon} shadow-sm`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">{template.title}</CardTitle>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Last updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  {template.rank && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Rank:</span> {template.rank}
                    </div>
                  )}
                  {template.rating && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Rating:</span> {template.rating}
                    </div>
                  )}
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditTemplateAction(template)}
                      className="transition-colors duration-200"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDeleteTemplateAction(template.id)}
                      className="transition-colors duration-200"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {templateList.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Evaluations Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Create your first evaluation template to get started. Templates help you quickly generate professional Navy evaluations.
          </p>
          <Button onClick={onCreateTemplateAction} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Evaluation
          </Button>
        </div>
      )}
    </div>
  )
}