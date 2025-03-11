# FMS Calculator Database Integration Guide

This guide explains how to integrate the database-enabled saved calculations feature into the FMS Calculator.

## Overview

The FMS Calculator currently uses localStorage to save and load calculations. This integration will replace the localStorage implementation with a database solution, allowing users to:

- Access their saved calculations across devices
- Maintain calculations even after clearing browser data
- Share calculations between different calculators in the future

## Integration Steps

### 1. Replace the SavedCalculationsModal Component

Replace the current `SavedCalculationsModal` import in your FMS calculator component with the database-enabled version:

```tsx
// Before
import { SavedCalculationsModal } from "@/components/fms/saved-calculations-modal"

// After
import { SavedCalculationsModal } from "@/components/fms/saved-calculations-modal-db"
```

### 2. Ensure Authentication Context is Available

The database-enabled component requires the authentication context to be available. Make sure your FMS calculator page is wrapped with the auth provider:

```tsx
// In src/app/fms-calculator/page.tsx or similar
import { AuthProvider } from "@/contexts/auth/auth-provider"

export default function FMSCalculatorPage() {
  return (
    <AuthProvider>
      <FMSCalculator />
    </AuthProvider>
  )
}
```

### 3. Update API Routes (if needed)

The implementation uses the following API endpoint:
- `/api/calculator-data` - For CRUD operations on calculator data

Ensure this endpoint is accessible and properly configured in your application.

### 4. Test the Integration

1. Sign in to your application
2. Navigate to the FMS Calculator
3. Try saving a calculation
4. Verify it appears in the "Load Saved" tab
5. Try loading a saved calculation
6. Try deleting a saved calculation

## Implementation Details

### Database Table Structure

The `calculator_data` table has the following structure:

| Column          | Type        | Description                                |
|-----------------|-------------|--------------------------------------------|
| id              | UUID        | Primary key                                |
| user_id         | UUID        | Foreign key to auth.users                  |
| calculator_type | VARCHAR     | Type of calculator (e.g., 'fms', 'pma')    |
| name            | VARCHAR     | User-provided name for the calculation     |
| data            | JSONB       | The calculator data in JSON format         |
| created_at      | TIMESTAMPTZ | When the calculation was created           |
| updated_at      | TIMESTAMPTZ | When the calculation was last updated      |
| version         | VARCHAR     | Version of the calculator                  |
| is_favorite     | BOOLEAN     | Whether the calculation is favorited       |
| notes           | TEXT        | Optional notes about the calculation       |

### API Endpoints

#### GET /api/calculator-data

Fetches saved calculations for the authenticated user.

Query parameters:
- `calculatorType` - Type of calculator (default: 'fms')

#### POST /api/calculator-data

Saves a new calculation.

Request body:
```json
{
  "name": "My Calculation",
  "data": { /* calculator form data */ },
  "calculatorType": "fms"
}
```

#### PUT /api/calculator-data

Updates an existing calculation.

Request body:
```json
{
  "id": "uuid-of-calculation",
  "name": "Updated Name",
  "data": { /* updated calculator form data */ },
  "is_favorite": true
}
```

#### DELETE /api/calculator-data

Deletes a calculation.

Query parameters:
- `id` - ID of the calculation to delete

## Troubleshooting

### User Not Authenticated

If users are not being authenticated properly:
1. Check that the auth provider is correctly set up
2. Verify that the user session is being properly maintained
3. Check browser console for any authentication errors

### Data Not Saving

If calculations are not being saved:
1. Check network requests in browser dev tools
2. Verify that the API endpoint is responding correctly
3. Check server logs for any errors
4. Verify database permissions are set correctly

### Data Not Loading

If saved calculations are not appearing:
1. Verify that the user is authenticated
2. Check that the calculator type is correct
3. Check network requests for any errors
4. Verify that the data exists in the database

## Next Steps

After integrating the database-enabled component, consider:

1. Adding a favorite feature to allow users to mark important calculations
2. Implementing sharing functionality between users
3. Adding export/import capabilities for calculations
4. Extending the same pattern to other calculators in your application