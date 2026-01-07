---
applyTo: "src/**/*.ts"
---

## TypeScript Development Guidelines

When working with TypeScript files in this project, follow these conventions:

### Type Safety

1. **Strict mode**: All TypeScript is compiled with strict mode enabled
2. **No implicit any**: Always provide explicit types for function parameters and return values
3. **Type assertions**: Use type assertions sparingly and only when necessary. Prefer type guards when possible.
4. **Error handling**: Cast errors properly using `error instanceof Error` checks:
   ```typescript
   try {
     // code
   } catch (error: unknown) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     console.error('Error:', errorMessage);
   }
   ```

### MCP Server Patterns

1. **Tool definitions**: Define tools using the `Tool` type from MCP SDK:
   ```typescript
   const MY_TOOL: Tool = {
     name: 'tool_name',
     description: 'Clear description of what the tool does',
     inputSchema: {
       type: 'object',
       properties: {
         param: {
           type: 'string',
           description: 'Parameter description',
         },
       },
       required: ['param'],
     },
   };
   ```

2. **Request handlers**: Use proper MCP schema types:
   ```typescript
   server.setRequestHandler(CallToolRequestSchema, async (request) => {
     // Handler implementation
   });
   ```

3. **Tool responses**: Return responses with proper content structure:
   ```typescript
   return {
     content: [
       {
         type: 'text',
         text: JSON.stringify(data, null, 2),
       },
     ],
   };
   ```

### Module System

- Use ES modules (import/export) not CommonJS
- File extensions must be included in imports from node_modules: `.js` extension for compiled output
- Import statements should use full paths: `'@modelcontextprotocol/sdk/server/index.js'`

### Node.js Features

- Use `fetch` for HTTP requests (available in Node.js 18+)
- Use `console.error` for logging (output goes to stderr to avoid interfering with stdio transport)
- Use async/await for asynchronous operations
- Properly handle process lifecycle (process.exit, error events)

### Testing Considerations

- Changes to tools should be tested with `node test-server.mjs`
- Ensure tool input schemas match the actual parameters used
- Verify error handling works correctly for invalid inputs
- Test both success and failure cases
