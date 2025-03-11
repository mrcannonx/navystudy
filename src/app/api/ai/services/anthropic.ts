// This file is kept for backward compatibility
// It re-exports the refactored AnthropicService from the new modular implementation

import { AnthropicService } from './anthropic/index';

// Re-export the main service class
export { AnthropicService };

// Export the default instance for backward compatibility
export default AnthropicService;
