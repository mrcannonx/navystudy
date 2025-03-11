# Navy Rating Content Generator

This document explains how to use the AI-powered Navy Rating Content Generator, which automatically generates comprehensive descriptions, keywords, and achievements for Navy ratings.

## Overview

The Rating Content Generator uses a combination of AI and rule-based approaches to generate structured content for Navy ratings. It takes information about a rating and produces:

1. **Description**: A comprehensive description of the rating's responsibilities and role
2. **Keywords**: Relevant technical terms, equipment names, and responsibilities
3. **Achievements**: Template achievement statements that can be used in evaluations

## How It Works

The generator follows this process:

1. First attempts to use AI (Anthropic's Claude) to generate high-quality content
   - For large inputs (>4000 characters), the text is automatically chunked into smaller pieces
   - Each chunk is processed sequentially, with context maintained between chunks
   - The final chunk generates the complete structured output
2. If AI generation fails, falls back to a rule-based approach that extracts information from the provided text
3. Returns structured content that can be used in the Eval Template Builder

### Smart Chunking

The generator includes a smart chunking system that:

- Breaks large inputs into semantically meaningful sections
- Maintains context between chunks to ensure coherence
- Preserves important technical information across chunk boundaries
- Handles inputs of any size, even those exceeding Claude's token limits

## Setup

To use the AI-powered generation:

1. Make sure you have an Anthropic API key
2. Add your API key to the `.env` file:
   ```
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ANTHROPIC_MODEL=claude-3-opus-20240229  # Optional: Defaults to claude-3-5-sonnet if not set
   ```
3. Restart the application if it's already running

## API Usage

### Endpoint

```
POST /api/generate-rating-content
```

### Request Body

```json
{
  "ratingAbbreviation": "IT",
  "serviceRating": "Information Systems Technician",
  "inputText": "Information about the rating..."
}
```

- `ratingAbbreviation`: The abbreviation of the rating (e.g., "IT", "BM", "HM")
- `serviceRating`: The full name of the rating
- `inputText`: Detailed information about the rating

### Response

```json
{
  "description": "Comprehensive description of the rating...",
  "keywords": "keyword1, keyword2, keyword3, ...",
  "achievements": "Achievement 1\nAchievement 2\nAchievement 3\n..."
}
```

## Testing

You can test the API using the included test script:

```bash
npx ts-node src/app/api/generate-rating-content/test.ts
```

This will run a test with sample data and display the generated content.

## Fallback Mechanism

If the AI service is unavailable or returns invalid data, the generator will automatically fall back to a rule-based approach that:

1. Extracts descriptions from the input text
2. Identifies keywords through pattern matching
3. Generates achievements using templates and extracted information

This ensures the system continues to function even if there are issues with the AI service.

## Integration with Eval Template Builder

The generated content is designed to be used with the Eval Template Builder. The structured format makes it easy to:

1. Populate description fields
2. Suggest relevant keywords
3. Provide achievement templates that can be customized

## Troubleshooting

If you're not getting AI-generated content:

1. Check that your Anthropic API key is valid and has sufficient credits
2. Verify that the API key is correctly set in the `.env` file
3. Check the server logs for any error messages related to the AI service
4. Ensure your network allows connections to the Anthropic API
5. Try specifying a different Claude model in the `.env` file if you're experiencing issues

## Future Improvements

Planned enhancements include:

- Support for more specialized rating types
- Improved achievement templates based on rating-specific responsibilities
- Integration with additional AI models for enhanced content generation
- Caching of generated content to reduce API usage