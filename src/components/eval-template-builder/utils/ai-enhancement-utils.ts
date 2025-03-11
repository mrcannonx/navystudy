import { AISuggestion } from '../types';
import { ToastProps } from '../types';
import { debug } from './error-utils';
import { handleError } from './error-utils';

/**
 * Enhances text content using AI
 */
export const enhanceWithAI = async (
  text: string,
  activeSection: string,
  setIsEnhancingAction: (isEnhancing: boolean) => void,
  setAiSuggestionsAction: (updater: (prev: AISuggestion[]) => AISuggestion[]) => void,
  addToastAction: (props: ToastProps) => void,
  setIsDemoMode?: (isDemoMode: boolean) => void,
  rating?: string,
  role?: string
): Promise<void> => {
  setIsEnhancingAction(true);
  
  try {
    // Validate inputs - only check for activeSection
    if (!activeSection) {
      const error = new Error('Missing required section parameter for AI enhancement');
      handleError(error, addToastAction, 'Cannot enhance content: missing section parameter');
      setIsEnhancingAction(false);
      return;
    }
    
    // Handle empty text content
    if (!text || text.trim() === '') {
      debug('AI Enhancement: Empty content detected');
      
      // Check if demo mode is enabled via the setter function
      // If setIsDemoMode is provided, we can use demo mode
      if (setIsDemoMode) {
        debug('AI Enhancement: Demo mode available, using sample suggestions');
        
        // Use sample suggestions as fallback for empty content
        const sampleSuggestions = generateSectionSpecificSuggestions(activeSection);
        if (sampleSuggestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * sampleSuggestions.length);
          const suggestion = sampleSuggestions[randomIndex];
          
          setAiSuggestionsAction(prev => [suggestion, ...prev]);
          
          // Enable demo mode
          setIsDemoMode(true);
          
          addToastAction({
            title: 'Demo Mode',
            description: 'Using sample enhancement. Add content to use AI enhancement.',
            variant: 'default'
          });
        }
      } else {
        debug('AI Enhancement: Demo mode not available or disabled');
        addToastAction({
          title: 'Cannot Enhance',
          description: 'Please add some content to enhance.',
          variant: 'destructive'
        });
      }
      
      setIsEnhancingAction(false);
      return;
    }
    
    // Log the request parameters for debugging
    debug('AI Enhancement Request:', {
      activeSection,
      textLength: text.length,
      rating: rating || 'Not provided',
      role: role || 'Not provided'
    });
    
    // Send the activeSection, rating, and role to the API
    // to get context-specific enhancements
    debug('Sending API request to enhance content');
    
    try {
      const response = await fetch('/api/eval-template/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
          section: activeSection,
          rating: rating || '',
          role: role || ''
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        debug('API response error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        // Handle specific error cases
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication error: Please log in again');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded: Please try again later');
        } else if (response.status >= 500) {
          throw new Error('Server error: The AI service is currently unavailable');
        } else {
          throw new Error(`Failed to enhance content: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      debug('Received API response:', data);
      
      if (data.success && data.enhancedContent) {
        // Add to AI suggestions
        setAiSuggestionsAction(prev => [
          {
            original: text,
            improved: data.enhancedContent,
            type: `${capitalizeFirstLetter(activeSection)} enhancement${rating ? ` for ${rating}` : ''}`
          },
          ...prev
        ]);
        
        addToastAction({
          title: 'Success',
          description: `Content enhanced for ${capitalizeFirstLetter(activeSection)} section`,
        });
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (error) {
      // Network errors will be caught here
      debug('Network or fetch error:', error);
      throw error; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    debug('Error enhancing content:', error);
    
    // If API fails, use sample suggestions as fallback
    if (setIsDemoMode) {
      debug('Falling back to demo mode');
      const sampleSuggestions = generateSectionSpecificSuggestions(activeSection);
      if (sampleSuggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * sampleSuggestions.length);
        const suggestion = sampleSuggestions[randomIndex];
        
        setAiSuggestionsAction(prev => [suggestion, ...prev]);
        
        addToastAction({
          title: 'Demo Mode',
          description: `Using sample enhancement for ${capitalizeFirstLetter(activeSection)} section`,
        });
        
        setIsDemoMode(true);
      } else {
        handleError(error, addToastAction, 'Failed to enhance content with AI');
      }
    } else {
      handleError(error, addToastAction, 'Failed to enhance content with AI');
    }
  } finally {
    setIsEnhancingAction(false);
  }
};

/**
 * Helper function to capitalize the first letter of a string
 */
const capitalizeFirstLetter = (string: string): string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Generates section-specific AI suggestions for demonstration purposes
 */
export const generateSectionSpecificSuggestions = (section: string): AISuggestion[] => {
  debug(`Generating sample suggestions for section: ${section}`);
  switch (section) {
    case 'professional':
      return [
        {
          original: "Maintained network servers.",
          improved: "Maintained 7 critical network servers with 99.8% uptime, ensuring uninterrupted communications during 3 major fleet exercises.",
          type: "Professional Knowledge enhancement"
        },
        {
          original: "Completed security training.",
          improved: "Completed advanced cybersecurity certification, applying knowledge to harden 12 systems against emerging threats.",
          type: "Professional Knowledge enhancement"
        },
        {
          original: "Managed database systems.",
          improved: "Managed 5 mission-critical database systems supporting 300+ users with zero data loss incidents.",
          type: "Professional Knowledge enhancement"
        }
      ];
    case 'quality':
      return [
        {
          original: "Produced quality work.",
          improved: "Produced exceptional work with zero rework required, maintaining 99.8% accuracy rate across all assigned tasks.",
          type: "Quality of Work enhancement"
        },
        {
          original: "Used resources efficiently.",
          improved: "Maximized resource utilization, reducing operational costs by 15% while improving output quality by 22%.",
          type: "Quality of Work enhancement"
        },
        {
          original: "Required minimal supervision.",
          improved: "Operated independently with no supervision required, completing 45 complex tasks with zero errors or deficiencies.",
          type: "Quality of Work enhancement"
        }
      ];
    case 'climate':
      return [
        {
          original: "Supported diversity initiatives.",
          improved: "Actively promoted inclusive environment, organizing 3 diversity awareness events that improved team cohesion by 40%.",
          type: "Command/Organizational Climate enhancement"
        },
        {
          original: "Mentored junior personnel.",
          improved: "Mentored 5 diverse junior personnel, providing 120 hours of professional development that directly contributed to 100% retention rate.",
          type: "Command/Organizational Climate enhancement"
        },
        {
          original: "Participated in command climate events.",
          improved: "Initiated 2 command climate improvement programs, fostering atmosphere of acceptance that was recognized in command climate assessment.",
          type: "Command/Organizational Climate enhancement"
        }
      ];
    case 'military':
      return [
        {
          original: "Passed uniform inspections.",
          improved: "Achieved perfect scores on 6 consecutive uniform inspections, selected to represent division at command inspection.",
          type: "Military Bearing enhancement"
        },
        {
          original: "Completed physical training.",
          improved: "Maintained Excellent-Low PFA score for 3 consecutive cycles, improving run time by 45 seconds.",
          type: "Military Bearing enhancement"
        },
        {
          original: "Attended required trainings.",
          improved: "Completed 100% of required GMT with perfect scores, volunteered as command training coordinator for 2 modules.",
          type: "Military Bearing enhancement"
        }
      ];
    case 'accomplishment':
      return [
        {
          original: "Participated in security training.",
          improved: "Spearheaded implementation of new security protocols, training 15 personnel and reducing security incidents by 37%.",
          type: "Job Accomplishment enhancement"
        },
        {
          original: "Suggested process improvements.",
          improved: "Identified and implemented 3 process improvements that saved 12 labor hours weekly and eliminated recurring errors.",
          type: "Job Accomplishment enhancement"
        },
        {
          original: "Volunteered for additional duties.",
          improved: "Volunteered 45 hours for command community relations events, coordinating 5 sailors' participation in local STEM education program.",
          type: "Job Accomplishment enhancement"
        }
      ];
    case 'teamwork':
      return [
        {
          original: "Helped junior sailors.",
          improved: "Mentored 4 junior ITs through PQS completion, resulting in 100% qualification rate 30 days ahead of schedule.",
          type: "Teamwork enhancement"
        },
        {
          original: "Worked with other departments.",
          improved: "Collaborated with 3 departments to streamline cross-functional workflows, reducing processing time by 35%.",
          type: "Teamwork enhancement"
        },
        {
          original: "Participated in team projects.",
          improved: "Contributed technical expertise to 5-person team project, delivering critical communications capability 2 weeks early.",
          type: "Teamwork enhancement"
        }
      ];
    case 'leadership':
      return [
        {
          original: "Led team meetings.",
          improved: "Led weekly team meetings for 8-person division, implementing structured agenda that improved productivity by 25%.",
          type: "Leadership enhancement"
        },
        {
          original: "Supervised junior personnel.",
          improved: "Supervised 6 junior personnel through major system upgrade, ensuring zero operational impact during transition.",
          type: "Leadership enhancement"
        },
        {
          original: "Delegated tasks to team.",
          improved: "Strategically delegated tasks based on team members' strengths, resulting in 40% faster project completion and professional growth opportunities.",
          type: "Leadership enhancement"
        }
      ];
    // For backward compatibility
    case 'initiative':
      return [
        {
          original: "Participated in security training.",
          improved: "Spearheaded implementation of new security protocols, training 15 personnel and reducing security incidents by 37%.",
          type: "Initiative enhancement"
        },
        {
          original: "Suggested process improvements.",
          improved: "Identified and implemented 3 process improvements that saved 12 labor hours weekly and eliminated recurring errors.",
          type: "Initiative enhancement"
        },
        {
          original: "Volunteered for additional duties.",
          improved: "Volunteered 45 hours for command community relations events, coordinating 5 sailors' participation in local STEM education program.",
          type: "Initiative enhancement"
        }
      ];
    default:
      return [];
  }
};

/**
 * Generates sample AI suggestions for demonstration purposes
 * @deprecated Use generateSectionSpecificSuggestions instead
 */
export const generateSampleAISuggestions = (): AISuggestion[] => {
  return [
    {
      original: "Maintained network servers.",
      improved: "Maintained 7 critical network servers with 99.8% uptime, ensuring uninterrupted communications during 3 major fleet exercises.",
      type: "Added metrics and mission impact"
    },
    {
      original: "Helped junior sailors.",
      improved: "Mentored 4 junior ITs through PQS completion, resulting in 100% qualification rate 30 days ahead of schedule.",
      type: "Added specificity and quantifiable results"
    },
    {
      original: "Participated in security training.",
      improved: "Spearheaded implementation of new security protocols, training 15 personnel and reducing security incidents by 37%.",
      type: "Strengthened action verb and added outcomes"
    }
  ];
};

/**
 * Categorizes the type of enhancement made by AI
 */
export const categorizeEnhancement = (original: string, improved: string): string => {
  // This is a simplified implementation
  // In a real application, this would use more sophisticated analysis
  debug('Categorizing enhancement:', {
    originalLength: original?.length || 0,
    improvedLength: improved?.length || 0
  });
  
  if (!original || !improved) {
    debug('Missing original or improved text for categorization');
    return "Unknown enhancement";
  }
  
  if (improved.match(/\d+%/) && !original.match(/\d+%/)) {
    debug('Enhancement categorized as: Added percentage metrics');
    return "Added percentage metrics";
  }
  
  if (improved.match(/\d+/) && !original.match(/\d+/)) {
    debug('Enhancement categorized as: Added numerical metrics');
    return "Added numerical metrics";
  }
  
  if (improved.length > original.length * 1.5) {
    debug('Enhancement categorized as: Expanded with details');
    return "Expanded with details";
  }
  
  debug('Enhancement categorized as: General improvement');
  return "General improvement";
};