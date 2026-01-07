# Usage Examples

This document provides examples of how to use the Personal Website MCP Server with ChatGPT.

## Quick Start

Once you've connected the MCP server to ChatGPT, you can use natural language to interact with your personal website.

## Example Conversations

### Scraping Posts

**You:** Show me the latest posts from my website

**ChatGPT:** *Uses the `scrape_posts` tool to fetch and display posts from pmmcbride.com in an interactive widget*

---

**You:** What blog posts do I have on my website?

**ChatGPT:** *Calls `scrape_posts` and presents the results with titles, content previews, and links*

---

### Using REST API Tools (Placeholders)

**You:** Get the latest 10 posts from my API

**ChatGPT:** *Attempts to use `get_posts` tool, but since the API isn't set up yet, it will return a placeholder message explaining that the REST API needs to be implemented*

---

**You:** Create a new blog post titled "Hello World" with content "This is my first post"

**ChatGPT:** *Calls `create_post` tool with the provided parameters, but returns a placeholder response indicating that the REST API needs to be implemented first*

---

## Tool Parameters

### scrape_posts
- **No parameters required**
- Simply ask ChatGPT to show/fetch/get posts from your website

### get_posts (Placeholder)
- **limit** (optional): Number of posts to retrieve
- Example: "Get 5 posts from my API"

### create_post (Placeholder)
- **title** (required): Title of the blog post
- **content** (required): Content of the blog post  
- **author** (optional): Author of the blog post
- Example: "Create a post titled 'My Title' with content 'My content' by 'Author Name'"

## Widget Features

When the `scrape_posts` tool is called, an interactive widget is displayed showing:
- Post titles
- Content previews (truncated to 200 characters)
- Links to read the full posts
- Refresh button to fetch latest posts

The widget is responsive and works on both desktop and mobile devices.

## Troubleshooting

### "Unable to scrape website" error
This can happen if:
- The website is temporarily unavailable
- Network connectivity issues
- The website structure has changed

**Solution:** Try refreshing or check if the website is accessible directly.

### REST API placeholders
The `get_posts` and `create_post` tools are currently placeholders. To make them functional:
1. Implement the REST API at `https://mcp.pmmcbride.com`
2. Add the following endpoints:
   - `GET /posts` - Return list of posts
   - `POST /posts` - Create a new post
3. Update the server implementation to call these endpoints

## Integration with Other Tools

The MCP server can work alongside other ChatGPT features:
- Ask ChatGPT to summarize the scraped posts
- Have ChatGPT analyze trends in your blog content
- Generate new post ideas based on existing content
- Compare posts from different time periods

## Best Practices

1. **Be specific:** Instead of "show me posts", try "show me the 5 most recent posts from my website"
2. **Use natural language:** The MCP server works with conversational requests
3. **Check the widget:** The interactive widget provides additional functionality like refresh
4. **Combine tools:** You can ask ChatGPT to perform multiple operations in sequence

## Advanced Usage

### Combining with ChatGPT's capabilities

**You:** Scrape my website posts and create a summary of the main topics

**ChatGPT:** *First calls `scrape_posts`, then analyzes the content and provides a summary*

---

**You:** Get posts from my website and suggest 3 new blog post ideas based on what I've written

**ChatGPT:** *Scrapes posts, analyzes themes, and generates creative suggestions*

---

## Future Enhancements

Once the REST API is implemented, you'll be able to:
- Create new posts directly from ChatGPT
- Update existing posts
- Delete or archive old posts
- Search and filter posts by category or date
- Get analytics on post performance
