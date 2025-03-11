# Career Roadmap Feature

The Career Roadmap feature allows sailors to create personalized career advancement pathways, identify qualification gaps, and set timeline goals for their Navy career progression.

## Features

1. **Visual Career Path Mapping**: Create a visual flowchart of your career progression path
2. **Qualification Gap Analysis**: Identify missing qualifications needed for advancement
3. **Timeline Estimation**: Set and track timeline goals for career milestones
4. **Exportable Career Plans**: Export your career roadmap as PDF or print it

## Setup Instructions

### 1. Install Dependencies

Run the installation script to install the required dependencies:

```bash
bash scripts/install-career-roadmap-deps.sh
```

Or manually install the dependencies:

```bash
npm install reactflow@11.10.4
```

### 2. Set Up Database Tables

Run the database migration script to create the necessary tables:

```bash
npm run setup-career-roadmap-tables
```

This will create the following tables in your Supabase database:
- `career_plans`: Stores user career plans
- `career_milestones`: Stores milestones for each career plan

### 3. Verify Installation

After installation, you should see a "Career Roadmap" card in the dashboard quick actions section. Click on it to access the Career Roadmap Builder.

## Usage Guide

### Creating a Career Plan

1. Navigate to the Career Roadmap page
2. Click "Create Your First Plan" or "New Plan"
3. Enter your current rating, rank, and target rating and rank
4. Save the plan

### Adding Milestones

1. In the Career Path tab, click "Add Milestone"
2. Enter milestone details:
   - Title
   - Description
   - Milestone type (rank advancement, qualification, training, etc.)
   - Estimated completion date
3. Click "Add Milestone" to save

### Analyzing Qualification Gaps

1. Go to the Gap Analysis tab
2. View required qualifications vs. current qualifications
3. Add qualifications you've already completed
4. View prioritized action items for missing qualifications

### Setting Timeline Goals

1. Go to the Timeline tab
2. Set estimated completion dates for each milestone
3. Mark milestones as completed as you achieve them
4. Track your overall progress

### Exporting Your Roadmap

1. Go to the Export tab
2. Choose your preferred export format (PDF or Print)
3. Preview the exported document
4. Click "Export" to download or print

## Technical Details

The Career Roadmap feature is built using:

- Next.js for the frontend
- Supabase for the database
- ReactFlow for the visual flowchart
- Tailwind CSS for styling

The feature follows a component-based architecture with the following main components:

- `RoadmapBuilder`: Main component for building career roadmaps
- `RoadmapVisualizer`: Visual flowchart of the career path
- `QualificationGapAnalysis`: Analysis of qualification gaps
- `TimelineEstimator`: Timeline planning and tracking
- `ExportPanel`: Export functionality

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed correctly
2. Verify that the database tables were created successfully
3. Check browser console for any JavaScript errors
4. Ensure your Supabase environment variables are set correctly

For database issues, you can manually run the SQL script:

```bash
cat scripts/create_career_roadmap_tables.sql | psql your_database_url