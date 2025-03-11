"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { EvaluationTemplateData, TemplateSections, BragSheetEntry, SectionKey } from '../types'
import { defaultTemplateSections } from '../template-data'
import { debug, handleError } from '../utils/error-utils'
import { serializeComplexField, deserializeComplexField, mapDatabaseToUI, mapUIToDatabase } from '../utils/data-utils'

export interface Template {
  id: string
  title: string
  rank: string
  rating: string
  role: string
  eval_type: string
  
  // Advanced fields - Personal Information
  name?: string
  desig?: string
  ssn?: string
  
  // Status Information
  duty_status?: {
    act: boolean
    fts: boolean
    inact: boolean
    at_adsw_drilling: boolean
  }
  uic?: string
  ship_station?: string
  promotion_status?: string
  date_reported?: string
  
  // Report Information
  occasion_for_report?: {
    periodic: boolean
    detachment: boolean
    promotion_frocking: boolean
    special: boolean
  }
  
  // Period of Report
  report_period?: {
    from: string
    to: string
  }
  
  // Report Type
  not_observed_report?: boolean
  report_type?: {
    regular: boolean
    concurrent: boolean
  }
  
  // Additional Information
  physical_readiness?: string
  billet_subcategory?: string
  
  // Command Information
  command_employment?: string
  primary_duties?: string
  
  // Counseling Information
  counseling_info?: {
    date_counseled: string
    counselor: string
    signature: boolean
  }
  
  // Core data
  sections: TemplateSections
  brag_sheet_entries: BragSheetEntry[]
  is_demo_mode?: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export function useTemplates(userId: string) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  // Create an authenticated Supabase client
  const supabaseClient = createClientComponentClient()

  // Fetch user's templates
  useEffect(() => {
    async function fetchTemplates() {
      try {
        // Get the current session
        const { data: { session } } = await supabaseClient.auth.getSession()
        
        if (!session) {
          toast({
            title: 'Authentication Error',
            description: 'You need to be logged in to access this feature',
            variant: 'destructive'
          })
          return
        }
        
        // Use the authenticated user's ID from the session
        const authenticatedUserId = session.user.id
        
        // Fetch templates
        const { data, error } = await supabaseClient
          .from('evaluation_templates')
          .select('*')
          .eq('user_id', authenticatedUserId)
          .order('updated_at', { ascending: false })
          
        if (error) throw error
        setTemplates(data || [])
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `Failed to load your templates: ${error.message || String(error)}`,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [userId, toast])

  // Function to set the current template with proper UI updates
  const setCurrentTemplateWithUIUpdate = (template: Template) => {
    debug("Setting current template:", {
      id: template.id,
      title: template.title
    });
    
    // Create a deep copy of the template to ensure UI updates
    // This avoids reference issues that can cause state updates to be missed
    const templateCopy = JSON.parse(JSON.stringify(template));
    
    // Set the template directly - no need for setTimeout which can cause race conditions
    setCurrentTemplate(templateCopy);
  };

  // Map a database template to the frontend template data structure
  const mapTemplateToTemplateData = (template: Template): EvaluationTemplateData => {
    debug("Mapping template to template data:", {
      id: template.id,
      title: template.title
    });
    
    try {
      // Use the utility function to map database fields to UI fields
      return mapDatabaseToUI(template) as EvaluationTemplateData;
    } catch (error) {
      // Handle any errors during mapping
      debug("Error mapping template data:", error);
      
      // Return a basic template with default values if mapping fails
      return {
        title: template.title || 'Untitled Template',
        rank: template.rank || '',
        rating: template.rating || '',
        role: template.role || '',
        evalType: template.eval_type || '',
        sections: template.sections || defaultTemplateSections,
        bragSheetEntries: template.brag_sheet_entries || [],
        isDemoMode: template.is_demo_mode || false
      };
    }
  };

  // Load templates function
  const loadTemplates = async () => {
    try {
      setLoading(true)
      debug("Loading templates for user:", userId)
      
      const { data, error } = await supabaseClient
        .from('evaluation_templates')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      
      debug("Templates loaded:", { count: data?.length || 0 })
      
      if (error) {
        throw error
      }
      
      setTemplates(data || [])
      return data
    } catch (error) {
      debug("Error loading templates:", error)
      handleError(error, toast, 'Failed to load templates')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Load template function
  const loadTemplate = (template: Template) => {
    debug("Loading template:", {
      id: template.id,
      title: template.title
    });
    
    try {
      // Create a deep copy of the template to avoid reference issues
      const templateCopy = JSON.parse(JSON.stringify(template));
      
      // Map the database template to the frontend template data structure
      const templateData = mapTemplateToTemplateData(templateCopy);
      
      // Update the current template state with the copy
      setCurrentTemplate(templateCopy);
      
      return templateData;
    } catch (error) {
      debug("Error loading template:", error);
      handleError(error, toast, 'Failed to load template');
      
      // Return a basic template with default values if loading fails
      return {
        title: template.title || 'Untitled Template',
        rank: template.rank || '',
        rating: template.rating || '',
        role: template.role || '',
        evalType: template.eval_type || '',
        sections: defaultTemplateSections,
        bragSheetEntries: [],
        isDemoMode: false
      };
    }
  }

  // Save template function
  const saveTemplate = async (templateData: EvaluationTemplateData) => {
    debug("Saving template:", {
      title: templateData.title,
      rank: templateData.rank,
      rating: templateData.rating
    });
    
    try {
      setIsCreating(true);
      
      // Get the current session
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      // Get the authenticated user ID
      const userId = session.user.id;
      debug("Authenticated user ID:", userId);
      
      // Validate and sanitize the template data
      debug("Sanitizing template data");
      
      // Ensure the title is a string and not empty, prioritizing the custom title
      let title = "Template";
      if (typeof templateData.title === 'string' && templateData.title.trim() !== '') {
        title = templateData.title.trim();
      } else {
        title = `${templateData.rank} ${templateData.rating} ${templateData.role || ''} Evaluation`;
      }
      
      // Convert the UI template data to database format using our utility function
      const dbTemplate = mapUIToDatabase({
        ...templateData,
        title,
        user_id: userId
      });
      
      // Create the template object with proper typing
      const template: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {
        ...dbTemplate,
        user_id: userId
      } as Omit<Template, 'id' | 'created_at' | 'updated_at'>;
      
      debug("Template prepared for saving");
      
      let result;

      if (currentTemplate?.id) {
        // Update existing template
        debug("Updating existing template with ID:", currentTemplate.id);
        const { data, error } = await supabaseClient
          .from('evaluation_templates')
          .update({
            ...template,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTemplate.id)
          .select('*');

        if (error) {
          throw error;
        }
        
        result = data?.[0];
        
        toast({
          title: 'Success',
          description: 'Evaluation template updated successfully',
        });
      } else {
        // Create new template
        debug("Creating new template");
        const { data, error } = await supabaseClient
          .from('evaluation_templates')
          .insert(template)
          .select('*');

        if (error) {
          throw error;
        }
        
        result = data?.[0];
        
        toast({
          title: 'Success',
          description: 'Evaluation template saved successfully',
        });
      }

      // Update templates list
      debug("Template saved successfully:", result?.id);
      
      if (result) {
        // Update the templates list with the new/updated template
        setTemplates(prev => {
          const filtered = prev.filter(t => t.id !== result.id);
          return [result, ...filtered];
        });
        
        // Create a deep copy of the result to ensure UI updates properly
        const resultCopy = JSON.parse(JSON.stringify(result));
        
        // Update the current template state with the copy
        setCurrentTemplateWithUIUpdate(resultCopy);
      }
      
      setIsCreating(false);
    } catch (error: any) {
      debug("Error saving template:", error);
      handleError(error, toast, 'Failed to save evaluation template');
    } finally {
      setLoading(false)
    }
  }

  // Delete template function
  const deleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      debug("Deleting template with ID:", id);
      
      // Get the current session
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }
      
      // Delete the template
      const { error } = await supabaseClient
        .from('evaluation_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update templates list
      setTemplates(prev => prev.filter(t => t.id !== id));
      
      // Reset current template if it was deleted
      if (currentTemplate?.id === id) {
        setCurrentTemplate(null);
        setIsCreating(false);
      }
      
      toast({
        title: 'Success',
        description: 'Evaluation template deleted successfully',
      });
      
      debug("Template deleted successfully:", id);
    } catch (error: any) {
      debug("Error deleting template:", error);
      handleError(error, toast, 'Failed to delete evaluation template');
    } finally {
      setLoading(false);
    }
  }

  // Create new template
  const createNewTemplate = () => {
    debug("Creating new template");
    setCurrentTemplate(null);
    setIsCreating(true);
  }

  // Cancel editing/creating
  const cancelEditing = () => {
    debug("Canceling template editing");
    setIsCreating(false);
    setCurrentTemplate(null);
  }
  
  return {
    templates,
    currentTemplate,
    isCreating,
    loading,
    setCurrentTemplate: setCurrentTemplateWithUIUpdate,
    saveTemplate,
    deleteTemplate,
    createNewTemplate,
    cancelEditing,
    loadTemplates,
    loadTemplate
  }
}