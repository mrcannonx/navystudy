import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { SummarizerState, Summarizer, SummarizerInput, SummarizerUpdateInput } from '@/types/summarizer';
import { fetchSummaries, createSummary, deleteSummary, updateSummary } from '@/lib/db/summarizer';

export function useSummarizerData() {
  const [state, setState] = useState<SummarizerState>({
    summaries: [],
    isLoading: false,
    error: null,
  });

  const { user } = useAuth();

  const isAuthenticated = useCallback(() => {
    return !!user?.id;
  }, [user]);

  const fetchSavedSummaries = useCallback(async () => {
    if (!isAuthenticated() || !user) {
      setState(prev => ({ 
        ...prev, 
        summaries: [],
        isLoading: false,
        error: null 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const summaries = await fetchSummaries(user);
      setState(prev => ({
        ...prev,
        summaries,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error in fetchSavedSummaries:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch summaries',
        isLoading: false,
      }));
    }
  }, [user, isAuthenticated]);

  const saveSummary = useCallback(async (input: SummarizerInput) => {
    if (!isAuthenticated() || !user) {
      const error = 'Please sign in to save summaries';
      setState(prev => ({ 
        ...prev, 
        error,
        isLoading: false 
      }));
      throw new Error(error);
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const newSummary = await createSummary(user, input);
      
      setState(prev => ({
        ...prev,
        summaries: [newSummary, ...prev.summaries],
        isLoading: false,
      }));

      return newSummary;
    } catch (error) {
      console.error('Error in saveSummary:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save summary',
        isLoading: false,
      }));
      throw error;
    }
  }, [user, isAuthenticated]);

  const removeSummary = useCallback(async (id: string) => {
    if (!isAuthenticated() || !user) {
      setState(prev => ({ 
        ...prev, 
        error: 'Please sign in to delete summaries',
        isLoading: false 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await deleteSummary(user, id);
      
      setState(prev => ({
        ...prev,
        summaries: prev.summaries.filter(summary => summary.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error in removeSummary:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete summary',
        isLoading: false,
      }));
    }
  }, [user, isAuthenticated]);

  const updateExistingSummary = useCallback(async (id: string, updates: SummarizerUpdateInput) => {
    if (!isAuthenticated() || !user) {
      setState(prev => ({ 
        ...prev, 
        error: 'Please sign in to update summaries',
        isLoading: false 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const updatedSummary = await updateSummary(user, id, updates);
      
      setState(prev => ({
        ...prev,
        summaries: prev.summaries.map(summary => 
          summary.id === id ? updatedSummary : summary
        ),
        isLoading: false,
      }));

      return updatedSummary;
    } catch (error) {
      console.error('Error in updateExistingSummary:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update summary',
        isLoading: false,
      }));
    }
  }, [user, isAuthenticated]);

  return {
    ...state,
    isAuthenticated: isAuthenticated(),
    fetchSavedSummaries,
    saveSummary,
    deleteSummary: removeSummary,
    updateSummary: updateExistingSummary,
  };
}