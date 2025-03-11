"use client"

import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Folder, Edit, Calendar } from 'lucide-react'
import { Template } from './hooks/useTemplates'
import { ScrollArea } from '@/components/ui/scroll-area'

interface LoadTemplateDialogProps {
  isOpen: boolean
  onCloseAction: () => void
  onLoadAction: (template: Template) => void
  templates: Template[]
  loading: boolean
}

export function LoadTemplateDialog({
  isOpen,
  onCloseAction,
  onLoadAction,
  templates,
  loading
}: LoadTemplateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Load Template</DialogTitle>
          <DialogDescription>
            Select a template to load
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading your templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>You don't have any saved templates yet.</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className="border rounded-md p-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onLoadAction(template)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.rank} {template.rating} - {template.role}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadAction(template);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Load
                      </Button>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last updated: {new Date(template.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}