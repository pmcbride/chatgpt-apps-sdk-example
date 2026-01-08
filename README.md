# ChatGPT Apps SDK Example - Personal Website Integration

Example ChatGPT App + MCP Server that integrates with pmmcbride.com through the Model Context Protocol (MCP).

> 🚀 **[Quick Start Guide →](./QUICKSTART.md)** - Get running in 5 minutes!
>
> 📝 **[Original Prompt →](./ORIGINAL_PROMPT.md)** - View the original problem statement

## Overview

This project demonstrates how to build a ChatGPT app using the Apps SDK that connects to a personal website. The MCP server exposes tools for:

- **scrape_posts**: Scrapes blog posts directly from https://pmmcbride.com
- **get_posts**: Placeholder for future REST API endpoint (GET /posts)
- **create_post**: Placeholder for future REST API endpoint (POST /posts)

## Prerequisites

- Node.js 18+
- npm or pnpm
- ChatGPT Plus or Team account with developer mode enabled

## Installation

1. Clone the repository:

```bash
git clone https://github.com/pmcbride/chatgpt-apps-sdk-example.git
cd chatgpt-apps-sdk-example
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Development

### Running the MCP Server Locally

The MCP server runs on stdio transport. To test it locally, you can use the MCP Inspector or run it directly:

```bash
npm run dev
```

### Building Widgets

Build the widget assets:

```bash
npm run build
```

This will compile TypeScript and bundle the widget HTML/CSS/JS into the `assets/` directory.

### Serving Static Assets

To serve the widget assets locally (required for the MCP server to reference them):

```bash
npm run serve
```

This starts an HTTP server on port 4444 with CORS enabled.

## Testing

### Testing the MCP Server

A test script is provided to verify the MCP server functionality:

```bash
node test-server.mjs
```

This will:

1. Start the MCP server
2. List all available tools
3. Test the `scrape_posts` tool
4. Test the `get_posts` tool (placeholder)
5. Test the `create_post` tool (placeholder)

Note: The `scrape_posts` tool may not work in restricted network environments but will function correctly when deployed or in ChatGPT.

### Manual Testing with MCP Inspector

You can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to manually test and debug your MCP server.

To start the inspector with the server:

```bash
make inspector
```

Or manually:

```bash
npx @modelcontextprotocol/inspector@latest node dist/server.js
```

This will launch a web interface where you can list tools, call them interactively, and inspect the JSON-RPC traffic.

## Connecting to ChatGPT

### Option 1: Using ngrok (for local testing)

1. Start your MCP server:

```bash
npm start
```

2. In another terminal, expose it via ngrok:

```bash
ngrok http 3000
```

3. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)

4. In ChatGPT:
   - Enable [developer mode](https://platform.openai.com/docs/guides/developer-mode)
   - Go to Settings → Connectors
   - Add a new connector
   - Enter the MCP endpoint: `https://abc123.ngrok-free.app/mcp`

### Option 2: Deploy to Production

Deploy the MCP server to your hosting platform (e.g., Railway, Render, Fly.io) and use the production URL.

The MCP endpoint should be configured at: `https://mcp.pmmcbride.com/mcp`

### Option 3: Local MCP Client (Claude Desktop, etc.)

For local MCP clients like Claude Desktop, you can configure the server in your MCP settings file. Example configuration:

```json
{
  "mcpServers": {
    "personal-website": {
      "command": "node",
      "args": ["/path/to/chatgpt-apps-sdk-example/dist/server.js"]
    }
  }
}
```

Or use the provided `mcp-config.json` file as a template.

## Project Structure

```
.
├── src/
│   ├── server.ts           # MCP server implementation
│   └── widgets/
│       └── posts-widget.html  # Widget for displaying posts
├── assets/                 # Built widget assets (generated)
├── dist/                   # Compiled TypeScript (generated)
├── package.json
├── tsconfig.json
├── vite.config.mts
└── build-widget.mjs       # Widget build script
```

## Tools

### scrape_posts

Scrapes blog posts from pmmcbride.com and displays them in an interactive widget.

**Usage in ChatGPT:**

```
Show me the latest posts from my website
```

### get_posts (Placeholder)

Will retrieve posts from the REST API once implemented.

**Planned endpoint:** `GET https://mcp.pmmcbride.com/posts`

### create_post (Placeholder)

Will create a new post via the REST API once implemented.

**Planned endpoint:** `POST https://mcp.pmmcbride.com/posts`

## Future Enhancements

- [ ] Implement REST API for /posts endpoint
- [ ] Add authentication for create_post
- [ ] Add pagination support
- [ ] Add filtering and search capabilities
- [ ] Enhance widget UI with more interactive features
- [ ] Add caching for scraped posts

## Resources

- [Usage Examples](./USAGE.md) - Detailed examples of how to use the MCP server with ChatGPT
- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step instructions for deploying to production
- [ChatGPT Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [Apps SDK UI Library](https://openai.github.io/apps-sdk-ui)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Example Apps Repository](https://github.com/openai/openai-apps-sdk-examples)

## License

MIT
