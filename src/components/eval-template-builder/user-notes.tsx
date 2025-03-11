"use client"

import React, { useState } from 'react';
import { useUserNotes } from '@/hooks/use-user-notes';
// Add console logs for debugging
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UserNote } from '@/types/user-notes';
import { Loader2, Save, Plus, Trash, Edit, X, Search, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

/**
 * User Notes component for the evaluation template builder
 * Allows users to create, view, edit, and delete notes that persist across evaluation sessions
 */
export function UserNotes() {
  const { notes, loading, createNote, updateNote, deleteNote, fetchNotes, error } = useUserNotes();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<UserNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debug logs
  console.log('UserNotes component rendered', { notes, loading, error });

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle creating a new note
  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;
    
    console.log('Creating note with:', { content: newNoteContent, title: newNoteTitle });
    
    try {
      const result = await createNote({
        content: newNoteContent,
        title: newNoteTitle || undefined
      });
      
      console.log('Create note result:', result);
      
      if (result) {
        setNewNoteContent('');
        setNewNoteTitle('');
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      // Always close the modal, even if there was an error
      setIsCreating(false);
    }
  };

  // Handle updating an existing note
  const handleUpdateNote = async () => {
    if (!currentNote || !currentNote.content.trim()) return;
    
    try {
      const result = await updateNote({
        id: currentNote.id,
        content: currentNote.content,
        title: currentNote.title
      });
      
      if (result) {
        setCurrentNote(null);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      // Always close the modal, even if there was an error
      setIsEditing(false);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Notes</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchNotes()}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsCreating(true)}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-1" /> New Note
          </Button>
        </div>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Notes list */}
      <ScrollArea className="h-[400px]">
        {loading && !notes.length ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No notes match your search' : 'No notes yet. Create your first note!'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="relative group">
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {note.title || 'Untitled Note'}
                    </CardTitle>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                          setCurrentNote(note);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(note.created_at)}
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-sm whitespace-pre-wrap line-clamp-3">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Create Note Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Title (optional)"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full"
            />
            <Textarea
              placeholder="Enter your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[200px] w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNote} 
              disabled={!newNoteContent.trim() || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {currentNote && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Title (optional)"
                value={currentNote.title || ''}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                className="w-full"
              />
              <Textarea
                placeholder="Enter your note here..."
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                className="min-h-[200px] w-full"
              />
              <div className="text-xs text-muted-foreground">
                Created: {formatDate(currentNote.created_at)}
                {currentNote.updated_at !== currentNote.created_at && 
                  ` • Updated: ${formatDate(currentNote.updated_at)}`}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateNote} 
              disabled={!currentNote?.content.trim() || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Update Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}