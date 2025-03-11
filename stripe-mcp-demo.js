// Stripe MCP Server Demonstration
// This script shows how to use the Stripe MCP server to interact with the Stripe API

// In a real application, you would use the MCP server through Cline
// Here's a demonstration of how you would use various Stripe API tools

console.log("Stripe MCP Server Demonstration");
console.log("===============================");
console.log("");
console.log("The Stripe MCP server is configured with the following API keys:");
console.log("- Secret Key: sk_test_51QycCYIDT2AoVu2d1Cm4G0uCqrEAEfQQzbOGFOrbTafahsUBAdIyPFTMmIa9RBAzy8jAwsL8vGg2EW097wEgDfVx00GgVnz6gi");
console.log("- Publishable Key: pk_test_51QycCYIDT2AoVu2d0aHwGsCImzpBs35NNqOaOv8EFr4C06xbVYNVfhDUtd3y5soAvq9A3TSbFEsFJOVTmKzrZsJl00MX2e23gB");
console.log("");
console.log("Available tools:");
console.log("1. customers.create - Create a new customer");
console.log("2. customers.read - Read customer information");
console.log("3. products.create - Create a new product");
console.log("4. products.read - Read product information");
console.log("5. prices.create - Create a new price");
console.log("6. prices.read - Read price information");
console.log("7. paymentLinks.create - Create a new payment link");
console.log("8. invoices.create - Create a new invoice");
console.log("9. invoices.update - Update an existing invoice");
console.log("10. invoiceItems.create - Create a new invoice item");
console.log("11. balance.read - Retrieve balance information");
console.log("12. refunds.create - Create a new refund");
console.log("13. paymentIntents.read - Read payment intent information");
console.log("14. documentation.read - Search Stripe documentation");
console.log("");
console.log("Example usage in Cline:");
console.log("");
console.log("1. List all products:");
console.log(`
<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>products.read</tool_name>
<arguments>
{
  "limit": 5
}
</arguments>
</use_mcp_tool>
`);
console.log("");
console.log("2. Create a new product:");
console.log(`
<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>products.create</tool_name>
<arguments>
{
  "name": "Premium Subscription",
  "description": "Monthly premium subscription with all features",
  "default_price_data": {
    "currency": "usd",
    "unit_amount": 1999
  }
}
</arguments>
</use_mcp_tool>
`);
console.log("");
console.log("3. Create a payment link:");
console.log(`
<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>paymentLinks.create</tool_name>
<arguments>
{
  "line_items": [
    {
      "price_data": {
        "currency": "usd",
        "product_data": {
          "name": "T-shirt"
        },
        "unit_amount": 2000
      },
      "quantity": 1
    }
  ]
}
</arguments>
</use_mcp_tool>
`);
console.log("");
console.log("4. Search Stripe documentation:");
console.log(`
<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>documentation.read</tool_name>
<arguments>
{
  "query": "How to handle webhook events"
}
</arguments>
</use_mcp_tool>
`);
console.log("");
console.log("Stripe MCP server demonstration completed successfully!");
