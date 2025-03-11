"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, FileText, Calendar, Star, Clock, User, Award, Tag } from 'lucide-react'
import { Template } from '../hooks/useTemplates'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface EnhancedTemplateListProps {
  templates: Template[]
  loading: boolean
  onCreateTemplateAction: () => void
  onEditTemplateAction: (template: Template) => void
  onDeleteTemplateAction: (id: string) => void
}

export function EnhancedTemplateList({
  templates,
  loading,
  onCreateTemplateAction,
  onEditTemplateAction,
  onDeleteTemplateAction
}: EnhancedTemplateListProps) {
  // Ensure templates is an array
  const templateList = Array.isArray(templates) ? templates : [];
  
  // Color classes for template cards
  const getColorClass = (index: number) => {
    const colors = [
      {
        accent: "after:bg-blue-500",
        gradient: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900",
        border: "border-blue-200 dark:border-blue-800",
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      },
      {
        accent: "after:bg-purple-500",
        gradient: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900",
        border: "border-purple-200 dark:border-purple-800",
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
        badge: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      },
      {
        accent: "after:bg-green-500",
        gradient: "bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900",
        border: "border-green-200 dark:border-green-800",
        icon: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
        badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      },
      {
        accent: "after:bg-amber-500",
        gradient: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900",
        border: "border-amber-200 dark:border-amber-800",
        icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      }
    ];
    
    return colors[index % colors.length];
  };

  // Function to get evaluation type label
  const getEvalTypeLabel = (evalType: string | undefined) => {
    if (!evalType) return "Standard";
    
    switch (evalType.toLowerCase()) {
      case "fitrep":
        return "FITREP";
      case "eval":
        return "EVAL";
      case "chiefeval":
        return "Chief EVAL";
      default:
        return evalType;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 template-list-grid">
        {templateList.map((template, index) => {
          const colorClass = getColorClass(index);
          const updatedAt = new Date(template.updated_at);
          const timeAgo = formatDistanceToNow(updatedAt, { addSuffix: true });
          
          return (
            <Card
              key={template.id}
              className={`relative overflow-hidden template-card ${colorClass.gradient} ${colorClass.border} shadow-sm hover:shadow-md dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 after:absolute after:top-0 after:left-0 after:w-full after:h-1 ${colorClass.accent} after:rounded-t-lg`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${colorClass.icon} shadow-sm`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{template.title}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${colorClass.badge} font-medium`}>
                    {getEvalTypeLabel(template.eval_type)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {template.rank && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Star className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{template.rank}</span>
                      </div>
                    )}
                    {template.rating && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Tag className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{template.rating}</span>
                      </div>
                    )}
                    {template.name && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <User className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{template.name}</span>
                      </div>
                    )}
                    {template.role && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Award className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{template.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 pb-4 border-t border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/30">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditTemplateAction(template)}
                    className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700/90 transition-all duration-200 border-gray-200 dark:border-gray-700/70 text-gray-700 dark:text-gray-200"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTemplateAction(template.id)}
                    className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
        
        {/* Create New Template Card */}
        <Card
          className="relative overflow-hidden template-card bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-900 border-dashed border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/70 transition-all duration-300 flex flex-col justify-center items-center p-8 cursor-pointer"
          onClick={onCreateTemplateAction}
        >
          <div className="p-4 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 mb-4 shadow-sm dark:shadow-blue-900/20">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-2">Create New Template</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
            Start building a new evaluation template
          </p>
        </Card>
      </div>
      
      {templateList.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-900/95 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mb-4 shadow-sm dark:shadow-blue-900/20">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">No Evaluations Yet</h3>
          <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-md mx-auto">
            Create your first evaluation template to get started. Templates help you quickly generate professional Navy evaluations.
          </p>
          <Button
            onClick={onCreateTemplateAction}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 text-base font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5" />
            Create Your First Evaluation
          </Button>
        </div>
      )}
    </div>
  )
}