import { db } from './db';
import { 
  UserNote, 
  CreateUserNoteParams, 
  UpdateUserNoteParams, 
  UserNotesResponse, 
  UserNoteResponse 
} from '@/types/user-notes';

/**
 * Service for managing user notes
 * Notes are stored independently from evaluation contexts and persist across sessions
 */
export const userNotesService = {
  /**
   * Create a new user note
   * @param params Note content and optional metadata
   * @returns The created note or an error
   */
  async createNote(params: CreateUserNoteParams): Promise<UserNoteResponse> {
    console.log('userNotesService: Creating note with params:', params);
    try {
      // Get the current user
      const userResponse = await db.auth.getUser();
      console.log('userNotesService: Auth user response:', userResponse);
      
      // Check if we have a valid session
      const { data: sessionData } = await db.auth.getSession();
      console.log('userNotesService: Current session check for createNote:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id || 'none'
      });
      
      // Try to get user from either source
      let user = userResponse.data.user;
      
      // If no user from getUser, try from session
      if (!user && sessionData.session?.user) {
        console.log('userNotesService: Using user from session instead of getUser for createNote');
        user = sessionData.session.user;
      }
      
      if (!user) {
        console.error('userNotesService: User not authenticated');
        return {
          data: null,
          error: new Error('User not authenticated')
        };
      }
      
      console.log('userNotesService: User authenticated, user ID:', user.id);

      // Insert the note into the database
      console.log('userNotesService: Inserting note into database');
      const insertData = {
        user_id: user.id,
        content: params.content,
        title: params.title || null,
        tags: params.tags || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('userNotesService: Insert data:', insertData);
      
      const dbResponse = await db
        .from('user_notes')
        .insert(insertData)
        .select()
        .single();
        
      console.log('userNotesService: Database response:', dbResponse);
      
      const { data, error } = dbResponse;

      if (error) {
        console.error('userNotesService: Error creating note:', error);
        return {
          data: null,
          error: new Error(`Failed to create note: ${error.message}`)
        };
      }

      console.log('userNotesService: Note created successfully:', data);
      return {
        data: data as UserNote,
        error: null
      };
    } catch (error) {
      console.error('userNotesService: Unexpected error creating note:', error);
      return {
        data: null,
        error: error instanceof Error
          ? error
          : new Error('An unexpected error occurred while creating the note')
      };
    }
  },

  /**
   * Get all notes for the current user
   * @returns Array of user notes or an error
   */
  async getNotes(): Promise<UserNotesResponse> {
    console.log('userNotesService: Fetching notes');
    try {
      // Get the current user
      const userResponse = await db.auth.getUser();
      console.log('userNotesService: Auth user response for getNotes:', userResponse);
      
      // Check if we have a valid session
      const { data: sessionData } = await db.auth.getSession();
      console.log('userNotesService: Current session check:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id || 'none'
      });
      
      // Try to get user from either source
      let user = userResponse.data.user;
      
      // If no user from getUser, try from session
      if (!user && sessionData.session?.user) {
        console.log('userNotesService: Using user from session instead of getUser');
        user = sessionData.session.user;
      }
      
      if (!user) {
        console.error('userNotesService: User not authenticated for getNotes');
        return {
          data: null,
          error: new Error('User not authenticated')
        };
      }
      
      console.log('userNotesService: User authenticated for getNotes, user ID:', user.id);

      // Fetch all notes for the user, ordered by most recent first
      console.log('userNotesService: Querying database for notes');
      const dbResponse = await db
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      console.log('userNotesService: Database response for getNotes:', dbResponse);
      
      const { data, error } = dbResponse;

      if (error) {
        console.error('userNotesService: Error fetching notes:', error);
        return {
          data: null,
          error: new Error(`Failed to fetch notes: ${error.message}`)
        };
      }

      console.log('userNotesService: Notes fetched successfully, count:', data?.length);
      return {
        data: data as UserNote[],
        error: null
      };
    } catch (error) {
      console.error('userNotesService: Unexpected error fetching notes:', error);
      return {
        data: null,
        error: error instanceof Error
          ? error
          : new Error('An unexpected error occurred while fetching notes')
      };
    }
  },

  /**
   * Get a specific note by ID
   * @param id The note ID
   * @returns The requested note or an error
   */
  async getNoteById(id: string): Promise<UserNoteResponse> {
    try {
      // Get the current user
      const userResponse = await db.auth.getUser();
      console.log('userNotesService: Auth user response for getNoteById:', userResponse);
      
      // Check if we have a valid session
      const { data: sessionData } = await db.auth.getSession();
      console.log('userNotesService: Current session check for getNoteById:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id || 'none'
      });
      
      // Try to get user from either source
      let user = userResponse.data.user;
      
      // If no user from getUser, try from session
      if (!user && sessionData.session?.user) {
        console.log('userNotesService: Using user from session instead of getUser for getNoteById');
        user = sessionData.session.user;
      }
      
      if (!user) {
        console.error('userNotesService: User not authenticated for getNoteById');
        return {
          data: null,
          error: new Error('User not authenticated')
        };
      }

      // Fetch the specific note
      const { data, error } = await db
        .from('user_notes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching note:', error);
        return {
          data: null,
          error: new Error(`Failed to fetch note: ${error.message}`)
        };
      }

      return {
        data: data as UserNote,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error fetching note:', error);
      return {
        data: null,
        error: error instanceof Error 
          ? error 
          : new Error('An unexpected error occurred while fetching the note')
      };
    }
  },

  /**
   * Update an existing note
   * @param params Update parameters including note ID and fields to update
   * @returns The updated note or an error
   */
  async updateNote(params: UpdateUserNoteParams): Promise<UserNoteResponse> {
    try {
      // Get the current user
      const userResponse = await db.auth.getUser();
      console.log('userNotesService: Auth user response for updateNote:', userResponse);
      
      // Check if we have a valid session
      const { data: sessionData } = await db.auth.getSession();
      console.log('userNotesService: Current session check for updateNote:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id || 'none'
      });
      
      // Try to get user from either source
      let user = userResponse.data.user;
      
      // If no user from getUser, try from session
      if (!user && sessionData.session?.user) {
        console.log('userNotesService: Using user from session instead of getUser for updateNote');
        user = sessionData.session.user;
      }
      
      if (!user) {
        console.error('userNotesService: User not authenticated for updateNote');
        return {
          data: null,
          error: new Error('User not authenticated')
        };
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Only include fields that are provided
      if (params.content !== undefined) updateData.content = params.content;
      if (params.title !== undefined) updateData.title = params.title;
      if (params.tags !== undefined) updateData.tags = params.tags;

      // Update the note
      const { data, error } = await db
        .from('user_notes')
        .update(updateData)
        .eq('id', params.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        return {
          data: null,
          error: new Error(`Failed to update note: ${error.message}`)
        };
      }

      return {
        data: data as UserNote,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error updating note:', error);
      return {
        data: null,
        error: error instanceof Error 
          ? error 
          : new Error('An unexpected error occurred while updating the note')
      };
    }
  },

  /**
   * Delete a note
   * @param id The ID of the note to delete
   * @returns Success status or an error
   */
  async deleteNote(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Get the current user
      const userResponse = await db.auth.getUser();
      console.log('userNotesService: Auth user response for deleteNote:', userResponse);
      
      // Check if we have a valid session
      const { data: sessionData } = await db.auth.getSession();
      console.log('userNotesService: Current session check for deleteNote:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id || 'none'
      });
      
      // Try to get user from either source
      let user = userResponse.data.user;
      
      // If no user from getUser, try from session
      if (!user && sessionData.session?.user) {
        console.log('userNotesService: Using user from session instead of getUser for deleteNote');
        user = sessionData.session.user;
      }
      
      if (!user) {
        console.error('userNotesService: User not authenticated for deleteNote');
        return {
          success: false,
          error: new Error('User not authenticated')
        };
      }

      // Delete the note
      const { error } = await db
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        return {
          success: false,
          error: new Error(`Failed to delete note: ${error.message}`)
        };
      }

      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error deleting note:', error);
      return {
        success: false,
        error: error instanceof Error 
          ? error 
          : new Error('An unexpected error occurred while deleting the note')
      };
    }
  },

  /**
   * Search for notes by content or title
   * @param searchTerm The term to search for
   * @returns Matching notes or an error
   */
  async searchNotes(searchTerm: string): Promise<UserNotesResponse> {
    try {
      // Get the current user
      const userResponse = await db.auth.getUser();
      console.log('userNotesService: Auth user response for searchNotes:', userResponse);
      
      // Check if we have a valid session
      const { data: sessionData } = await db.auth.getSession();
      console.log('userNotesService: Current session check for searchNotes:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id || 'none'
      });
      
      // Try to get user from either source
      let user = userResponse.data.user;
      
      // If no user from getUser, try from session
      if (!user && sessionData.session?.user) {
        console.log('userNotesService: Using user from session instead of getUser for searchNotes');
        user = sessionData.session.user;
      }
      
      if (!user) {
        console.error('userNotesService: User not authenticated for searchNotes');
        return {
          data: null,
          error: new Error('User not authenticated')
        };
      }

      // Search for notes containing the search term
      const { data, error } = await db
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .or(`content.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching notes:', error);
        return {
          data: null,
          error: new Error(`Failed to search notes: ${error.message}`)
        };
      }

      return {
        data: data as UserNote[],
        error: null
      };
    } catch (error) {
      console.error('Unexpected error searching notes:', error);
      return {
        data: null,
        error: error instanceof Error 
          ? error 
          : new Error('An unexpected error occurred while searching notes')
      };
    }
  }
};