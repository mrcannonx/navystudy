"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth/auth-context"
import { RSCACalculatorData } from "../types"
import { RSCASavedCalculationsModalProps } from "./types/rsca-calculations"
import { animationStyles } from "./utils/formatting-utils"
import { useRSCACalculations } from "./hooks/use-rsca-calculations"
import { RSCAModalHeader } from "./components/rsca-modal-header"
import { RSCAModalFooter } from "./components/rsca-modal-footer"
import { RSCATabNavigation } from "./components/rsca-tab-navigation"
import { RSCASaveTab } from "./components/rsca-save-tab"
import { RSCALoadTab } from "./components/rsca-load-tab"

/**
 * Modal component for saving and loading RSCA calculations
 * This is the main container that coordinates between the different tabs and components
 */
export function RSCASavedCalculationsModal({
  isOpen,
  onCloseAction,
  currentCalculatorData,
  onLoadAction
}: RSCASavedCalculationsModalProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save')
  
  // Use the custom hook to get calculations - always use database mode
  const { calculations } = useRSCACalculations()
  
  // If modal is not open, don't render anything
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out animate-slideUp">
        {/* Modal Header */}
        <RSCAModalHeader onCloseAction={onCloseAction} />
        
        {/* Tab Navigation */}
        <RSCATabNavigation
          activeTab={activeTab}
          onTabChangeAction={setActiveTab}
          savedCount={calculations.length}
        />
        
        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-grow">
          {activeTab === 'save' ? (
            <RSCASaveTab
              currentData={currentCalculatorData}
              onSaveSuccessAction={() => setActiveTab('load')}
            />
          ) : (
            <RSCALoadTab
              onLoadAction={onLoadAction}
              onCloseAction={onCloseAction}
            />
          )}
        </div>
        
        {/* Modal Footer */}
        <RSCAModalFooter onCloseAction={onCloseAction} />
      </div>
    </div>
  )
}