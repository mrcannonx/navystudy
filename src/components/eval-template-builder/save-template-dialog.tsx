"use client"

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import { EvaluationTemplateData } from './types'

interface SaveTemplateDialogProps {
  isOpen: boolean
  onCloseAction: () => void
  onSaveAction: (templateData: EvaluationTemplateData, customTitle: string) => void
  templateData: EvaluationTemplateData
  defaultTitle: string
}

export function SaveTemplateDialog({
  isOpen,
  onCloseAction,
  onSaveAction,
  templateData,
  defaultTitle
}: SaveTemplateDialogProps) {
  const [customTitle, setCustomTitle] = useState('')

  // Reset the custom title when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setCustomTitle(defaultTitle)
    }
  }, [isOpen, defaultTitle])

  const handleSave = () => {
    onSaveAction(templateData, customTitle.trim())
    onCloseAction()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Template</DialogTitle>
          <DialogDescription>
            Enter a name for your evaluation template
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Enter template name"
            className="w-full"
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!customTitle.trim()}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}