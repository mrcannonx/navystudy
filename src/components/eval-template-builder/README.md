# Navy Evaluation Builder

The Navy Evaluation Builder is a tool designed to help sailors create professional and impactful evaluations. It provides a structured interface for writing evaluation content, with features like AI enhancement, metrics library, and brag sheet integration.

## Features

### AI Enhancement

The AI Enhancement feature uses Claude 3 Sonnet to improve evaluation content by:

1. Adding specific metrics
2. Strengthening action verbs
3. Including quantifiable achievements
4. Making the text more impactful while maintaining military writing style

The enhancement is tailored to the sailor's:
- Navy Rating (e.g., CM - Construction Mechanic)
- Role/Billet (e.g., System Administrator)
- Evaluation section (e.g., Quality of Work, Leadership)

### Navy Ratings Database

The application includes a comprehensive database of Navy ratings with:
- Rating abbreviations (e.g., CM)
- Full rating names (e.g., Construction Mechanic)
- Detailed descriptions of rating responsibilities
- Common keywords associated with each rating
- Typical achievements for each rating
- Parent-child relationships for rating variations
- Service rating information for specialized variations

The database handles both general ratings (like AB - Aviation Boatswain's Mate) and their specialized variations (like ABE - Aviation Boatswain's Mate - Launching & Recovery). When a sailor selects a specific variation, the AI enhancement feature uses both the general rating information and the specialized variation information to provide tailored suggestions.

This approach ensures that the enhanced content is relevant and accurate for the specific rating and service specialization.

### Metrics Library

The Metrics Library provides pre-defined metrics for each evaluation section, helping sailors quantify their achievements.

### Brag Sheet Integration

The Brag Sheet feature allows sailors to maintain a record of their accomplishments throughout the evaluation period, which can then be easily incorporated into their evaluations.

## Implementation Details

### Database Structure

The Navy ratings are stored in a `navy_ratings` table with the following structure:

```sql
CREATE TABLE public.navy_ratings (
  id SERIAL PRIMARY KEY,
  abbreviation TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  common_achievements TEXT[] DEFAULT '{}',
  parent_rating TEXT REFERENCES public.navy_ratings(abbreviation) ON DELETE CASCADE,
  service_rating TEXT,
  is_variation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

The key fields for handling rating variations are:

- `parent_rating`: References the abbreviation of the parent rating (e.g., "AB" for "ABE")
- `service_rating`: Stores the service specialization (e.g., "Launching & Recovery" for "ABE")
- `is_variation`: Boolean flag indicating whether this is a variation of a general rating

### AI Enhancement Process

1. User selects their Navy rating and role/billet
2. User enters evaluation content in a section
3. User clicks "Enhance with AI" button
4. The application sends the content, rating, role, and section to the AI enhancement API
5. The API retrieves rating information from the database:
   - For general ratings, it retrieves the rating's information directly
   - For rating variations, it retrieves both the variation's information and the parent rating's information
6. The API constructs a prompt that includes rating-specific context:
   - For general ratings, it includes the rating's description, keywords, and common achievements
   - For rating variations, it combines information from both the variation and parent rating, with special emphasis on the service specialization
7. Claude 3 Sonnet generates enhanced content tailored to the specific rating and role
8. The enhanced content is displayed as a suggestion
9. User can apply the suggestion to replace the original content

### API Endpoints

- `POST /api/eval-template/enhance`: Enhances evaluation content using AI
- `POST /api/eval-template/generate-metrics`: Generates metrics based on rating, role, and section

## Usage

1. Select your Rank/Rate, Rating, and Role/Billet
2. Navigate to the evaluation section you want to work on
3. Enter your initial content
4. Click "Enhance with AI" to get AI-generated improvements
5. Review and apply the suggestions as needed
6. Continue to the next section

## Development

### Scripts

- `populate-navy-ratings.js`: Script to populate the Navy ratings database with data from the Navy ratings PDF

### Database Migrations

- `20250305_add_navy_ratings_table.sql`: Migration to create the Navy ratings table