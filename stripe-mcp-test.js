// This is a test file to demonstrate how to use the Stripe MCP server
// The MCP server is now configured with real Stripe API keys
// You can use this to interact with the Stripe API through Cline

// Example of how to use the Stripe MCP server to create a customer
// With the real API keys, this would actually create a customer in your Stripe account

/*
To use the Stripe MCP server in Cline, you would use the use_mcp_tool command like this:

<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>customers.create</tool_name>
<arguments>
{
  "name": "Test Customer",
  "email": "test@example.com",
  "description": "A test customer created via MCP"
}
</arguments>
</use_mcp_tool>

Or to read documentation:

<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>documentation.read</tool_name>
<arguments>
{
  "query": "How to create a payment link"
}
</arguments>
</use_mcp_tool>
*/

console.log("Stripe MCP server test file created successfully!");
