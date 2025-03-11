# Template Builder Hooks

This directory contains the refactored hooks for the Evaluation Template Builder. The original monolithic `useTemplateBuilder` hook has been split into smaller, more focused hooks that are then composed together.

## Structure

The hooks are organized as follows:

1. **useTemplateBasicInfo**: Manages basic template information (rank, rating, role, evalType, title)
2. **useTemplatePersonalInfo**: Manages personal and status information (name, desig, ssn, dutyStatus, etc.)
3. **useTemplateReportInfo**: Manages report-specific information (occasionForReport, reportPeriod, reportType, etc.)
4. **useTemplateCommandInfo**: Manages command-related information (commandEmployment, primaryDuties, counselingInfo)
5. **useTemplateUIState**: Manages UI state (showAdvanced, activeSection, showMetrics, etc.)
6. **useTemplateSections**: Manages template sections state and operations
7. **useTemplateBragSheet**: Manages brag sheet entries state and operations
8. **useTemplateAIEnhancement**: Manages AI suggestions and enhancement functionality
9. **useTemplateDataOperations**: Handles data operations like save, load, and clear

These hooks are composed together in the main `index.ts` file, which exports the `useTemplateBuilder` hook that maintains the same API as the original hook.

## Usage

The main hook can be imported from either the directory or from the original location:

```typescript
// Import from the refactored directory
import { useTemplateBuilder } from '@/components/eval-template-builder/hooks/template-builder';

// Or import from the original location (which now re-exports from the refactored directory)
import { useTemplateBuilder } from '@/components/eval-template-builder/hooks/useTemplateBuilder';
```

## Benefits of Refactoring

1. **Improved Maintainability**: Each hook has a single responsibility, making the code easier to understand and maintain.
2. **Better Testability**: Smaller hooks are easier to test in isolation.
3. **Enhanced Reusability**: Individual hooks can be reused in other components if needed.
4. **Easier Collaboration**: Different team members can work on different hooks without conflicts.
5. **Simplified Debugging**: Issues can be isolated to specific hooks.
6. **Clearer Code Organization**: The structure makes it immediately clear what each piece of code is responsible for.

## Example: Using Individual Hooks

If needed, you can also use the individual hooks directly:

```typescript
import { useTemplateBasicInfo } from './useTemplateBasicInfo';
import { useTemplateSections } from './useTemplateSections';

// In your component
const { rank, rating, setRank, setRating } = useTemplateBasicInfo({ initialData });
const { sections, updateSection } = useTemplateSections({ initialData });
```

This allows for more granular control and potentially better performance by only including the hooks you need.