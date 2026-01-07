# Quick Start Guide

Get your Personal Website MCP Server running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or pnpm
- ChatGPT Plus/Team account (for testing in ChatGPT)

## Installation

```bash
# Clone the repository
git clone https://github.com/pmcbride/chatgpt-apps-sdk-example.git
cd chatgpt-apps-sdk-example

# Install dependencies
npm install

# Build the project
npm run build
```

## Local Testing

### Test the MCP Server

```bash
node test-server.mjs
```

Expected output:
```
🧪 Testing MCP Server
✅ Tools listed successfully:
   - scrape_posts: Scrape blog posts from pmmcbride.com website
   - get_posts: Get blog posts from the REST API (placeholder - API not yet set up)
   - create_post: Create a new blog post via REST API (placeholder - API not yet set up)

✅ scrape_posts executed successfully
✅ get_posts executed (placeholder mode)
✅ create_post executed (placeholder mode)
✨ All tests completed!
```

### Start the Server

```bash
npm start
```

The server runs on stdio and is ready to receive MCP requests!

## Connect to ChatGPT

### Option 1: Local with ngrok (Recommended for Testing)

1. **Start the MCP server:**
```bash
npm start
```

2. **In another terminal, expose via ngrok:**
```bash
npx ngrok http 3000
```

3. **Copy the ngrok URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Configure in ChatGPT:**
   - Open ChatGPT
   - Go to Settings → Connectors
   - Click "Add Connector"
   - Paste your ngrok URL with `/mcp` path
   - Click "Connect"

### Option 2: Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Using the Tools

Once connected, try these commands in ChatGPT:

### Scrape Posts
```
Show me the latest posts from my website
```

### Get Posts (Placeholder)
```
Get 5 posts from my API
```

### Create Post (Placeholder)
```
Create a new post titled "Hello World" with content "This is my first post"
```

## Troubleshooting

### "Module not found" error
```bash
npm install
npm run build
```

### "Cannot connect to MCP server"
- Check that the server is running: `npm start`
- Verify ngrok is running and the URL is correct
- Ensure you're using the correct path: `/mcp`

### "Unable to scrape website"
- Check if pmmcbride.com is accessible
- Verify network connectivity
- This is expected in restricted environments

### Tests fail
- Make sure dependencies are installed: `npm install`
- Rebuild the project: `npm run build`
- Check Node.js version: `node --version` (should be 18+)

## What's Next?

1. **Customize for your website:**
   - Update `WEBSITE_URL` in `src/server.ts`
   - Adjust CSS selectors for your site structure

2. **Implement the REST API:**
   - Set up API endpoints at your domain
   - Update placeholder functions in `src/server.ts`

3. **Deploy to production:**
   - Follow the [Deployment Guide](./DEPLOYMENT.md)
   - Configure your domain
   - Set up SSL/TLS

4. **Enhance the widget:**
   - Customize the UI in `src/widgets/posts-widget.html`
   - Add new features like filtering or search

## Resources

- [Full Documentation](./README.md)
- [Usage Examples](./USAGE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [ChatGPT Apps SDK](https://developers.openai.com/apps-sdk)
- [MCP Specification](https://modelcontextprotocol.io)

## Need Help?

- Check the [Usage Guide](./USAGE.md) for detailed examples
- Review the [Contributing Guide](./CONTRIBUTING.md) for development tips
- Open an issue on GitHub if you encounter problems

## Success Checklist

- [ ] Dependencies installed
- [ ] Project builds without errors
- [ ] Tests pass
- [ ] Server starts successfully
- [ ] Connected to ChatGPT
- [ ] Can scrape posts from website

Congratulations! Your Personal Website MCP Server is ready to use! 🎉
