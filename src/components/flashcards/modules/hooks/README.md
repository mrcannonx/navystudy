# Flashcard Actions Hooks

This directory contains hooks for managing flashcard-related actions. The code has been refactored into smaller, more focused modules for better maintainability and separation of concerns.

## Structure

- `useFlashcardActions.ts` - Main hook that composes all other hooks
- `useStudySessionActions.ts` - Actions related to studying flashcards
- `useSettingsActions.ts` - Actions related to flashcard settings
- `useDeckManagementActions.ts` - Actions related to deck management (fetch, delete, reset)
- `types/flashcard-actions.types.ts` - Type definitions for flashcard actions

## Services

- `../services/flashcard-db.service.ts` - Database operations for flashcards

## Refactoring Approach

The original `useFlashcardActions.ts` file was refactored to address several issues:

1. **Separation of Concerns**: Split the large file into smaller, more focused modules
2. **Type Safety**: Added proper type definitions to reduce the need for type assertions
3. **Code Organization**: Grouped related functionality together
4. **Maintainability**: Made the code easier to understand and maintain
5. **Reusability**: Created more reusable components

## Usage

```tsx
// In a component
import { useFlashcardState } from './useFlashcardState';

function FlashcardComponent() {
  const { 
    // State
    decks, 
    currentDeck,
    
    // Actions
    fetchDecks,
    startStudying,
    nextCard,
    handleDeleteDeck,
    // ...other actions
  } = useFlashcardState();
  
  // Use the state and actions
}
```

## Flow

1. `useFlashcardState` creates and manages the state
2. `useFlashcardActions` composes all the action hooks
3. Each action hook handles a specific aspect of flashcard functionality
4. Database operations are abstracted into service files