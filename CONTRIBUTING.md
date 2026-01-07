# Contributing Guide

Thank you for your interest in contributing to the Personal Website MCP Server project!

## Development Setup

1. **Fork and clone the repository:**
```bash
git clone https://github.com/pmcbride/chatgpt-apps-sdk-example.git
cd chatgpt-apps-sdk-example
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

4. **Run tests:**
```bash
node test-server.mjs
```

## Project Structure

```
├── src/
│   ├── server.ts              # MCP server implementation
│   └── widgets/
│       └── posts-widget.html  # Interactive widget UI
├── dist/                      # Compiled TypeScript (generated)
├── assets/                    # Built widget assets (generated)
├── test-server.mjs           # Test script
├── build-widget.mjs          # Widget build script
└── package.json              # Dependencies and scripts
```

## Making Changes

### Adding a New Tool

1. **Define the tool in `src/server.ts`:**

```typescript
const NEW_TOOL: Tool = {
  name: 'tool_name',
  description: 'Description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of parameter',
      },
    },
    required: ['param1'],
  },
};
```

2. **Add the tool to the TOOLS array:**

```typescript
const TOOLS: Tool[] = [
  // ... existing tools
  NEW_TOOL,
];
```

3. **Implement the tool handler:**

```typescript
case 'tool_name': {
  const { param1 } = args as any;
  // Your implementation here
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
```

### Modifying the Widget

1. **Edit `src/widgets/posts-widget.html`**
2. **Rebuild:** `npm run build`
3. **Test in ChatGPT or with MCP Inspector**

### Adding Tests

Add test cases to `test-server.mjs`:

```javascript
console.log('Test N: Testing new_tool...');
const response = await sendRequest('tools/call', {
  name: 'new_tool',
  arguments: { param1: 'value' },
});

if (response.result) {
  console.log('✅ new_tool executed successfully');
} else {
  console.log('❌ new_tool failed');
}
```

## Code Style

- Use TypeScript for server code
- Follow ESLint rules (when configured)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

## Error Handling

Always use proper error handling:

```typescript
try {
  // Your code
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Error:', errorMessage);
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${errorMessage}`,
      },
    ],
    isError: true,
  };
}
```

## Testing Checklist

Before submitting a PR:

- [ ] Code builds successfully: `npm run build`
- [ ] Tests pass: `node test-server.mjs`
- [ ] No TypeScript errors
- [ ] Documentation updated if needed
- [ ] New tools have proper descriptions and input schemas
- [ ] Error handling is in place

## Submitting Changes

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes and commit:**
```bash
git add .
git commit -m "Description of your changes"
```

3. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

4. **Open a Pull Request** on GitHub

## Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Keep PRs focused on a single feature or fix

## Common Tasks

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Debugging

1. **Check server logs:**
```bash
npm start 2>&1 | tee server.log
```

2. **Use MCP Inspector:**
```bash
npx @modelcontextprotocol/inspector node dist/server.js
```

3. **Test individual tools:**
Edit `test-server.mjs` to focus on specific tools

### Adding New Widgets

1. Create a new HTML file in `src/widgets/`
2. Add it to `vite.config.mts` input
3. Update `build-widget.mjs` if needed
4. Reference it in your tool's `_meta['openai/outputTemplate']`

## Future Ideas

Want to contribute but not sure where to start? Here are some ideas:

- [ ] Implement the REST API endpoints (GET/POST /posts)
- [ ] Add authentication for protected tools
- [ ] Implement caching for scraped posts
- [ ] Add pagination to the widget
- [ ] Create additional widgets for different data types
- [ ] Add filtering and search capabilities
- [ ] Implement a CI/CD pipeline
- [ ] Add more comprehensive tests
- [ ] Create example deployments for different platforms
- [ ] Add monitoring and logging
- [ ] Optimize scraping with better selectors
- [ ] Add support for multiple websites

## Questions?

If you have questions:
- Open an issue on GitHub
- Check the [Usage Guide](./USAGE.md)
- Review the [Deployment Guide](./DEPLOYMENT.md)
- Consult the [MCP SDK documentation](https://modelcontextprotocol.io)

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
