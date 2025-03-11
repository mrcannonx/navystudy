# NavAdmin Viewer

The NavAdmin Viewer is a tool for formatting and displaying NAVADMIN messages in a clean, structured, and user-friendly format.

## Features

- **Text Input**: Paste raw NAVADMIN text directly into the input area
- **URL Input**: Provide a URL to fetch and process NAVADMIN content
- **Semantic Chunking**: Handles large NAVADMIN documents by breaking them into meaningful sections
- **Progress Tracking**: Shows processing status for large documents
- **PDF Export**: Save the formatted NAVADMIN as a PDF for offline viewing

## Technical Implementation

### Chunking System

The NavAdmin Viewer uses a semantic chunking system to handle large NAVADMIN documents efficiently:

1. **Preprocessing**: Normalizes line endings and spacing in the raw NAVADMIN text
2. **Semantic Chunking**: Breaks the content into chunks based on NAVADMIN-specific patterns:
   - NAVADMIN header sections
   - Message routing information (RTTUZYUW patterns)
   - FM/TO/INFO sections
   - Subject lines
   - Reference sections
   - Numbered and lettered paragraphs
   - POC (Point of Contact) sections
   - Classification markings

3. **Context Preservation**: Maintains context between chunks by:
   - Including overlap between chunks
   - Extracting and preserving key contextual information from previous chunks
   - Providing chunk position information to the AI model

4. **Chunk Processing**: Each chunk is processed individually with the Anthropic Claude API
5. **Result Combination**: Processed chunks are intelligently combined into a cohesive document

### Performance Considerations

- **Chunk Size**: Default maximum chunk size is 2000 characters
- **Overlap**: Uses 20% overlap between chunks to maintain context
- **Rate Limiting**: Includes delays between chunk processing to respect API rate limits
- **Retry Logic**: Implements exponential backoff for failed requests

## Usage

1. Sign in to access the NavAdmin Viewer
2. Choose between text input or URL input
3. Enter or paste your NAVADMIN content
4. Click "Process" to format the NAVADMIN
5. View the formatted content and download as PDF if needed

## Implementation Details

The NavAdmin Viewer is implemented as a Next.js application with the following components:

- **Frontend**: React components for user interface
- **API**: Edge runtime API endpoint for processing NAVADMIN content
- **Chunking Utilities**: Custom utilities for semantic chunking and processing
- **AI Integration**: Integration with Anthropic's Claude API for content formatting

## Future Improvements

- Real-time progress updates using Server-Sent Events or WebSockets
- Caching of processed NAVADMINs to improve performance
- Batch processing of multiple NAVADMINs
- Advanced search and filtering capabilities