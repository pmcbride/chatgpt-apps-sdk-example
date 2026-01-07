---
applyTo: "src/widgets/**/*.html"
---

## Widget Development Guidelines

Widgets are interactive HTML components that render within ChatGPT's interface. Follow these guidelines when creating or modifying widgets:

### Structure

1. **Self-contained**: Each widget is a complete HTML file with inline CSS and JavaScript
2. **Build process**: Widgets are processed by Vite and bundled into the `assets/` directory
3. **No external dependencies**: Avoid external CSS or JS files; keep everything inline or bundled

### ChatGPT Integration

1. **OpenAI API**: Use `window.openai` to interact with ChatGPT:
   ```javascript
   window.openai.addEventListener('message', (event) => {
     // Handle messages from ChatGPT
   });
   ```

2. **Widget metadata**: Reference widgets in tool responses using `_meta['openai/outputTemplate']`:
   ```typescript
   _meta: {
     'openai/outputTemplate': {
       type: 'asset',
       assetPath: 'assets/src/widgets/your-widget.html',
       contentType: 'text/html',
     },
   }
   ```

### Styling

1. **Responsive design**: Widgets should work across different viewport sizes
2. **Modern CSS**: Use Flexbox or Grid for layouts
3. **Consistent theme**: Match ChatGPT's design language where appropriate
4. **Hover states**: Provide visual feedback for interactive elements
5. **Smooth transitions**: Use CSS transitions for animations (e.g., `transition: all 0.2s ease`)

### JavaScript

1. **Vanilla JavaScript**: No external frameworks required
2. **Error handling**: Gracefully handle errors and display user-friendly messages
3. **Event listeners**: Clean up event listeners when appropriate
4. **Data fetching**: Handle loading states and network errors
5. **DOM manipulation**: Use modern DOM APIs (querySelector, addEventListener, etc.)

### User Experience

1. **Loading states**: Show visual feedback when fetching data
2. **Error messages**: Display clear, actionable error messages
3. **Interactive elements**: Make buttons and links clearly clickable
4. **Accessibility**: Use semantic HTML and proper ARIA attributes when needed
5. **Performance**: Keep widgets lightweight and fast-loading

### Testing

1. **Build**: Always rebuild after changes: `npm run build`
2. **Serve**: Test widgets locally: `npm run serve`
3. **ChatGPT**: Test the full integration within ChatGPT interface
4. **Edge cases**: Test error states, empty data, and network failures

### Best Practices

- Keep HTML semantic and well-structured
- Use meaningful class names
- Comment complex logic
- Optimize for readability and maintainability
- Ensure widgets work without internet connection when possible
