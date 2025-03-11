import { useState, useEffect, useCallback } from 'react';
import { userNotesService } from '@/lib/user-notes-service';
import { UserNote, CreateUserNoteParams, UpdateUserNoteParams } from '@/types/user-notes';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing user notes
 * Provides functions for creating, retrieving, updating, and deleting notes
 */
export function useUserNotes() {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch all notes for the current user
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    console.log('useUserNotes: Fetching notes');
    
    try {
      const response = await userNotesService.getNotes();
      console.log('useUserNotes: Fetch notes response:', response);
      
      if (response.error) {
        console.error('useUserNotes: Error fetching notes:', response.error);
        setError(response.error);
        toast({
          title: 'Error fetching notes',
          description: response.error.message,
          variant: 'destructive',
        });
      } else {
        console.log('useUserNotes: Notes fetched successfully:', response.data);
        setNotes(response.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('useUserNotes: Unexpected error fetching notes:', err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: 'Error fetching notes',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new note
  const createNote = useCallback(async (params: CreateUserNoteParams) => {
    setLoading(true);
    setError(null);
    
    console.log('useUserNotes: Creating note with params:', params);
    
    try {
      const response = await userNotesService.createNote(params);
      console.log('useUserNotes: Create note response:', response);
      
      if (response.error) {
        console.error('useUserNotes: Error creating note:', response.error);
        setError(response.error);
        toast({
          title: 'Error creating note',
          description: response.error.message,
          variant: 'destructive',
        });
        return null;
      } else {
        // Add the new note to the state
        if (response.data) {
          console.log('useUserNotes: Note created successfully:', response.data);
          setNotes(prevNotes => [response.data!, ...prevNotes]);
          toast({
            title: 'Note saved',
            description: 'Your note has been saved successfully.',
            variant: 'default',
          });
        }
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('useUserNotes: Unexpected error creating note:', err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: 'Error creating note',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update an existing note
  const updateNote = useCallback(async (params: UpdateUserNoteParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userNotesService.updateNote(params);
      
      if (response.error) {
        setError(response.error);
        toast({
          title: 'Error updating note',
          description: response.error.message,
          variant: 'destructive',
        });
        return null;
      } else {
        // Update the note in the state
        if (response.data) {
          setNotes(prevNotes => 
            prevNotes.map(note => 
              note.id === response.data!.id ? response.data! : note
            )
          );
          toast({
            title: 'Note updated',
            description: 'Your note has been updated successfully.',
            variant: 'default',
          });
        }
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: 'Error updating note',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete a note
  const deleteNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userNotesService.deleteNote(id);
      
      if (response.error) {
        setError(response.error);
        toast({
          title: 'Error deleting note',
          description: response.error.message,
          variant: 'destructive',
        });
        return false;
      } else {
        // Remove the note from the state
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        toast({
          title: 'Note deleted',
          description: 'Your note has been deleted successfully.',
          variant: 'default',
        });
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: 'Error deleting note',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Search for notes
  const searchNotes = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userNotesService.searchNotes(searchTerm);
      
      if (response.error) {
        setError(response.error);
        toast({
          title: 'Error searching notes',
          description: response.error.message,
          variant: 'destructive',
        });
        return [];
      } else {
        return response.data || [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: 'Error searching notes',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load notes when the component mounts
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes
  };
}