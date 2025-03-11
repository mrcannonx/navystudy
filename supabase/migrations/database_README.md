# RankStudy Database Reference

This directory contains SQL files that represent the database schema and sample data for the RankStudy application. These files are provided for reference and can be used to understand the database structure or to recreate the database if needed.

## Files

- `database_schema.sql`: Contains the complete database schema with table definitions, constraints, and row-level security policies.
- `database_sample_data.sql`: Contains sample data for all tables to demonstrate the data structure and relationships.

## Database Schema Overview

The RankStudy application uses a PostgreSQL database with the following main tables:

### User-related Tables

- **profiles**: Stores user profile information including username, rank, rate, and other personal details.
- **ranks**: Contains the different Navy ranks (E-1, E-2, etc.) with their display order.
- **chevrons**: Stores the chevron images and information associated with each rank.
- **insignias**: Stores the insignia images and information for different rates.

### Study Content Tables

- **flashcards**: Contains flashcard decks created by users, with cards stored as JSON.
- **quizzes**: Contains quizzes created by users, with questions stored as JSON.
- **summarizer**: Stores text summaries created by users.

### Activity and Analytics Tables

- **user_activities**: Tracks user activities such as completing quizzes or studying flashcards.
- **daily_active_users**: Tracks daily user activity for analytics.
- **user_retention**: Tracks user retention metrics.
- **platform_usage**: Records information about user sessions and devices.
- **learning_path_progress**: Tracks user progress through learning paths.

### Settings Tables

- **app_settings**: Stores application-wide settings.
- **reminder_settings**: Stores user-specific reminder preferences.

## Row-Level Security (RLS)

The database uses Postgres Row-Level Security to control access to data:

- Users can only access their own data (profiles, flashcards, quizzes, etc.)
- Some tables (ranks, chevrons, insignias) are readable by anyone but only modifiable by administrators
- Analytics tables are only accessible to administrators

## Using These Files

### To Recreate the Schema

```bash
psql -U your_username -d your_database -f database_schema.sql
```

### To Load Sample Data

```bash
psql -U your_username -d your_database -f database_sample_data.sql
```

### For Reference Only

These files can also be used as a reference to understand the database structure without actually executing them.

## Database Diagram

The database schema includes the following relationships:

- Profiles reference chevrons (chevron_id)
- Chevrons reference ranks (rank_id)
- Flashcards, quizzes, and summaries reference users (user_id)
- User activities reference users (user_id) and content (content_id)
- Analytics tables reference users (user_id)

## Notes

- The schema uses UUID as the primary key type for all tables
- JSON/JSONB is used for storing structured data like flashcards, quiz questions, and user preferences
- Timestamps are stored with timezone information
- Row-level security is implemented to ensure data privacy and security