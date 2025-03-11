# RSCA Saved Calculations Module

This module provides functionality for saving and loading RSCA (Rating Score Calculation Assistant) calculations. It was created as part of a refactoring effort to improve maintainability, readability, and testability of the original monolithic component.

## Directory Structure

```
rsca-saved-calculations/
├── components/                # UI components
│   ├── rsca-calculation-item.tsx     # Individual calculation item
│   ├── rsca-calculations-list.tsx    # List of calculations
│   ├── rsca-load-tab.tsx             # Load tab content
│   ├── rsca-modal-footer.tsx         # Modal footer
│   ├── rsca-modal-header.tsx         # Modal header
│   ├── rsca-save-tab.tsx             # Save tab content
│   ├── rsca-storage-mode-toggle.tsx  # Storage mode toggle
│   └── rsca-tab-navigation.tsx       # Tab navigation
├── hooks/                    # Custom hooks
│   └── use-rsca-calculations.ts      # Hook for managing calculations
├── types/                    # Type definitions
│   └── rsca-calculations.ts          # Shared types
├── utils/                    # Utility functions
│   ├── filtering-utils.ts            # Filtering and sorting
│   ├── formatting-utils.ts           # Date formatting and styles
│   └── storage-utils.ts              # Storage operations
├── index.tsx                 # Main exports
└── rsca-saved-calculations-modal.tsx # Main container component
```

## Key Components

### Main Container
- **RSCASavedCalculationsModal**: The main container component that orchestrates the overall modal functionality.

### Tab Components
- **RSCASaveTab**: Handles the "Save" tab functionality.
- **RSCALoadTab**: Handles the "Load" tab functionality.

### UI Components
- **RSCACalculationsList**: Renders the list of saved calculations.
- **RSCACalculationItem**: Individual saved calculation item.
- **RSCAStorageModeToggle**: Toggle between local and database storage.
- **RSCAModalHeader**: Header with title and close button.
- **RSCAModalFooter**: Footer with close button.
- **RSCATabNavigation**: Navigation between save and load tabs.

## Custom Hooks

- **useRSCACalculations**: Manages calculations in both local storage and database.

## Utilities

- **filtering-utils.ts**: Functions for filtering and sorting calculations.
- **formatting-utils.ts**: Functions for formatting dates and CSS animations.
- **storage-utils.ts**: Functions for local storage operations.

## Usage

```tsx
import { RSCASavedCalculationsModal } from '@/components/fms/rsca-saved-calculations';

// In your component
const [isModalOpen, setIsModalOpen] = useState(false);

// Render the modal
<RSCASavedCalculationsModal
  isOpen={isModalOpen}
  onCloseAction={() => setIsModalOpen(false)}
  currentCalculatorData={calculatorData}
  onLoadAction={(data) => setCalculatorData(data)}
/>
```

## Benefits of This Refactoring

1. **Improved Maintainability**:
   - Smaller, focused components are easier to understand and modify
   - Clear separation of concerns makes debugging simpler

2. **Better Testability**:
   - Isolated components can be tested independently
   - Business logic separated from UI is easier to test

3. **Enhanced Performance**:
   - Optimized rendering with proper component boundaries
   - Memoization for expensive operations

4. **Code Reusability**:
   - Generic components can be reused across the application
   - Utility functions provide consistent behavior