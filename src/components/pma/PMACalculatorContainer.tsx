"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { usePMACalculator } from "./hooks/usePMACalculator";
import { useCalculatorData } from "@/hooks/use-calculator-data";
import { PMADashboard } from "./pma-dashboard";
import { PMACalculatorForm } from "./PMACalculatorForm";
import { SaveButton } from "./components/SaveButton";
import { RSCAAlert } from "./components/RSCAAlert";
import { requiresRSCAPMA } from "./utils/pmaConstants";

/**
 * Main container component for the PMA Calculator
 * Handles data loading, state management, and composition of child components
 */
export function PMACalculatorContainer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dataLoadAttemptedRef = useRef(false);
  
  // Use the PMA calculator hook for state management
  const {
    paygrade,
    setPaygrade,
    evaluations,
    addEvaluation,
    removeEvaluation,
    updateEvaluation,
    getSortedEvaluations,
    pmaScore,
    resetEvaluations,
  } = usePMACalculator([]);
  
  // Get calculator data for loading and saving calculations
  const {
    savedCalculations,
    fetchCalculations,
    saveCalculation,
    updateCalculation,
  } = useCalculatorData({ calculatorType: "pma" });
  
  // Track if data has been loaded
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Initialize with default evaluation if none exist
  useEffect(() => {
    if (evaluations.length === 0) {
      addEvaluation();
    }
  }, [evaluations.length, addEvaluation]);

  // Load saved data when component mounts
  useEffect(() => {
    // Only reset dataLoaded flag on initial mount
    if (!dataLoaded) {
      console.log("DEBUG: Initial component mount, setting up data loading");
    }
    // We use a ref to track if this is the initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to fetch data when component mounts or user changes
  useEffect(() => {
    // Only attempt to load data once per component instance or when user changes
    if (dataLoadAttemptedRef.current && !user) {
      console.log("DEBUG: Data load already attempted without user, skipping");
      return;
    }
    
    // Mark that we've attempted to load data
    dataLoadAttemptedRef.current = true;
    console.log("DEBUG: Initial data load attempt");
    
    const loadSavedData = async () => {
      if (!user) {
        console.log("DEBUG: No user found, using default data");
        setDataLoaded(true);
        return;
      }
      
      console.log("DEBUG: User authenticated, loading saved data");
      setIsLoading(true);
      
      try {
        console.log("DEBUG: Fetching calculations from API");
        await fetchCalculations();
        
        // Don't mark as loaded yet - we'll do that in the effect that watches savedCalculations
        console.log("DEBUG: API fetch completed, waiting for savedCalculations to update");
      } catch (error) {
        console.error("DEBUG: Error loading saved data:", error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your saved data. Please try refreshing the page.",
          variant: "destructive"
        });
        // Don't mark as loaded on error, so we can try again
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  // Run this effect when component mounts and when user changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Effect to process savedCalculations changes and apply data
  useEffect(() => {
    console.log("DEBUG: savedCalculations changed:", savedCalculations);
    
    // Process if we have data and either:
    // 1. Data isn't loaded yet, or
    // 2. We have more saved calculations than before
    if (user && savedCalculations.length > 0) {
      console.log("DEBUG: First calculation details:", {
        id: savedCalculations[0].id,
        name: savedCalculations[0].name,
        type: savedCalculations[0].calculator_type,
        updated: savedCalculations[0].updated_at,
        evaluations: savedCalculations[0].data?.evaluations?.length || 0
      });
      
      // Apply the saved data
      const savedData = savedCalculations[0].data;
      console.log("DEBUG: Saved data content:", savedData);
      
      if (savedData && savedData.evaluations && savedData.evaluations.length > 0) {
        console.log("DEBUG: Applying saved evaluations:", savedData.evaluations);
        resetEvaluations(savedData.evaluations);
        
        if (savedData.paygrade) {
          console.log("DEBUG: Setting paygrade to:", savedData.paygrade);
          setPaygrade(savedData.paygrade);
        }
      } else {
        console.log("DEBUG: No evaluations found in saved data");
      }
      
      // Mark data as loaded if we successfully processed data
      console.log("DEBUG: Successfully loaded data from database");
      setDataLoaded(true);
    } else if (user && savedCalculations.length === 0 && dataLoadAttemptedRef.current) {
      // If we have a user but no saved calculations after attempting to load,
      // mark as loaded so we can use the default data
      console.log("DEBUG: No saved data found for user, using defaults");
      setDataLoaded(true);
    }
  }, [savedCalculations, user, resetEvaluations, setPaygrade]);
  
  // Save current state to database
  const saveCurrentState = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your PMA data",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const saveData = {
        paygrade,
        evaluations,
        pmaScore,
        lastUpdated: new Date().toISOString()
      };
      
      let result;
      if (savedCalculations.length > 0) {
        result = await updateCalculation(savedCalculations[0].id, { data: saveData });
      } else {
        result = await saveCalculation("My PMA Calculation", saveData);
      }
      
      // Mark data as loaded since we just saved it
      setDataLoaded(true);
      
      // Refresh calculations to get the latest data
      await fetchCalculations();
      
      toast({
        title: "Saved",
        description: "Your PMA data has been saved successfully"
      });
    } catch (error) {
      console.error('Error saving PMA data:', error);
      
      // Still allow user to continue using the calculator
      toast({
        title: "Save Error",
        description: "Your data is available locally but couldn't be saved to your account. You can try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Always show calculator components */}
      <PMADashboard
        pmaScore={pmaScore}
        paygrade={paygrade}
        evaluations={getSortedEvaluations()}
      />
      
      {requiresRSCAPMA(paygrade) && <RSCAAlert paygrade={paygrade} />}
      
      <PMACalculatorForm
        paygrade={paygrade}
        setPaygrade={setPaygrade}
        evaluations={getSortedEvaluations()}
        addEvaluation={addEvaluation}
        removeEvaluation={removeEvaluation}
        updateEvaluation={updateEvaluation}
        requiresRSCAPMA={requiresRSCAPMA(paygrade)}
        pmaScore={pmaScore}
      />
      
      {/* Save button with loading indicator moved to bottom */}
      <div className="flex justify-end mt-6 mb-4">
        <SaveButton
          isSaving={isLoading}
          onSaveAction={saveCurrentState}
        />
        {isLoading && (
          <div className="flex items-center ml-4 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Syncing data...</span>
          </div>
        )}
      </div>
    </div>
  );
}