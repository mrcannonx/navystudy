# Stripe MCP Server Usage Guide

## Setup Complete

The Stripe MCP server has been successfully set up with the following configuration:

- **Server Name**: github.com/stripe/agent-toolkit
- **Secret Key**: sk_test_51QycCYIDT2AoVu2d1Cm4G0uCqrEAEfQQzbOGFOrbTafahsUBAdIyPFTMmIa9RBAzy8jAwsL8vGg2EW097wEgDfVx00GgVnz6gi
- **Publishable Key**: pk_test_51QycCYIDT2AoVu2d0aHwGsCImzpBs35NNqOaOv8EFr4C06xbVYNVfhDUtd3y5soAvq9A3TSbFEsFJOVTmKzrZsJl00MX2e23gB

The server is currently running in a terminal window. To use the MCP server with Cline, you need to:

1. Keep the terminal window open (this is the MCP server process)
2. Restart Cline or reload the window to pick up the new MCP server configuration

## Available Tools

The Stripe MCP server provides the following tools:

1. `customers.create` - Create a new customer
2. `customers.read` - Read customer information
3. `products.create` - Create a new product
4. `products.read` - Read product information
5. `prices.create` - Create a new price
6. `prices.read` - Read price information
7. `paymentLinks.create` - Create a new payment link
8. `invoices.create` - Create a new invoice
9. `invoices.update` - Update an existing invoice
10. `invoiceItems.create` - Create a new invoice item
11. `balance.read` - Retrieve balance information
12. `refunds.create` - Create a new refund
13. `paymentIntents.read` - Read payment intent information
14. `documentation.read` - Search Stripe documentation

## Example Usage

### 1. List Products

To list products in your Stripe account:

```
<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>products.read</tool_name>
<arguments>
{
  "limit": 5
}
</arguments>
</use_mcp_tool>
```

### 2. Create a Product

To create a new product:

```
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
```

### 3. Create a Payment Link

To create a payment link:

```
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
```

### 4. Search Stripe Documentation

To search Stripe documentation:

```
<use_mcp_tool>
<server_name>github.com/stripe/agent-toolkit</server_name>
<tool_name>documentation.read</tool_name>
<arguments>
{
  "query": "How to handle webhook events"
}
</arguments>
</use_mcp_tool>
```

## Starting the Server Manually

If you need to restart the server, you can use the following command:

```
npx -y @stripe/mcp --tools=all --api-key=sk_test_51QycCYIDT2AoVu2d1Cm4G0uCqrEAEfQQzbOGFOrbTafahsUBAdIyPFTMmIa9RBAzy8jAwsL8vGg2EW097wEgDfVx00GgVnz6gi
```

## Configuration File

The MCP server configuration is stored in:
`C:\Users\badca\OneDrive\Documents\Cline\cline_mcp_settings.json`

This file contains the server configuration and API keys.
