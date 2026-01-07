import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import * as cheerio from 'cheerio';
const WEBSITE_URL = 'https://pmmcbride.com';
const MCP_API_URL = 'https://mcp.pmmcbride.com'; // Placeholder for when REST API is set up
// Tool definitions
const TOOLS = [
    {
        name: 'scrape_posts',
        description: 'Scrape blog posts from pmmcbride.com website',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_posts',
        description: 'Get blog posts from the REST API (placeholder - API not yet set up)',
        inputSchema: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of posts to retrieve',
                },
            },
            required: [],
        },
    },
    {
        name: 'create_post',
        description: 'Create a new blog post via REST API (placeholder - API not yet set up)',
        inputSchema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Title of the blog post',
                },
                content: {
                    type: 'string',
                    description: 'Content of the blog post',
                },
                author: {
                    type: 'string',
                    description: 'Author of the blog post',
                },
            },
            required: ['title', 'content'],
        },
    },
];
// Helper function to scrape posts from the website
async function scrapePosts() {
    try {
        const response = await fetch(WEBSITE_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ChatGPT-MCP-Bot/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        const posts = [];
        // Try to find blog posts - this is a generic scraper that looks for common patterns
        // Adjust selectors based on actual website structure
        $('article, .post, .blog-post').each((i, elem) => {
            const $elem = $(elem);
            const title = $elem.find('h1, h2, h3, .title, .post-title').first().text().trim();
            const content = $elem.find('p, .content, .post-content').first().text().trim();
            const link = $elem.find('a').first().attr('href');
            if (title) {
                posts.push({
                    title,
                    content: content || 'No content preview available',
                    link: link ? (link.startsWith('http') ? link : `${WEBSITE_URL}${link}`) : null,
                });
            }
        });
        // If no posts found with article/post selectors, try finding any headings with links
        if (posts.length === 0) {
            $('h1, h2, h3').each((i, elem) => {
                const $elem = $(elem);
                const title = $elem.text().trim();
                const $link = $elem.find('a').first();
                const link = $link.attr('href');
                if (title && link) {
                    posts.push({
                        title,
                        content: 'Click the link to read more',
                        link: link.startsWith('http') ? link : `${WEBSITE_URL}${link}`,
                    });
                }
            });
        }
        return posts.length > 0 ? posts : [{
                title: 'Website scraped successfully',
                content: 'No blog posts found with standard selectors. The website may use custom structure.',
                link: WEBSITE_URL
            }];
    }
    catch (error) {
        // Return a more user-friendly error response
        console.error('Scraping error:', error.message);
        return [{
                title: 'Unable to scrape website',
                content: `Error: ${error.message}. This could be due to network restrictions or the website being unavailable.`,
                link: WEBSITE_URL,
            }];
    }
}
// Helper function to get posts from REST API (placeholder)
async function getPosts(limit) {
    // This is a placeholder - the actual REST API is not set up yet
    return {
        message: 'REST API not yet set up',
        placeholder_url: `${MCP_API_URL}/posts`,
        note: 'Once the API is available, this will fetch posts from GET /posts endpoint',
        suggested_limit: limit || 10,
    };
}
// Helper function to create a post via REST API (placeholder)
async function createPost(title, content, author) {
    // This is a placeholder - the actual REST API is not set up yet
    return {
        message: 'REST API not yet set up',
        placeholder_url: `${MCP_API_URL}/posts`,
        note: 'Once the API is available, this will create a post via POST /posts endpoint',
        would_create: {
            title,
            content,
            author: author || 'Unknown',
        },
    };
}
// Create MCP server
const server = new Server({
    name: 'personal-website-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});
// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'scrape_posts': {
                const posts = await scrapePosts();
                // Generate HTML widget to display posts
                const postsHtml = posts
                    .map((post) => `
          <div class="post" style="border: 1px solid #e0e0e0; padding: 16px; margin-bottom: 12px; border-radius: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #1a1a1a;">${post.title}</h3>
            <p style="margin: 0 0 8px 0; color: #666;">${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</p>
            ${post.link ? `<a href="${post.link}" target="_blank" style="color: #0066cc; text-decoration: none;">Read more →</a>` : ''}
          </div>
        `)
                    .join('');
                const widgetHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                  margin: 0; 
                  padding: 16px;
                  background: #f9f9f9;
                }
                .container {
                  max-width: 800px;
                  margin: 0 auto;
                }
                h2 {
                  margin: 0 0 16px 0;
                  color: #1a1a1a;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Blog Posts from pmmcbride.com</h2>
                ${postsHtml}
              </div>
            </body>
          </html>
        `;
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(posts, null, 2),
                        },
                    ],
                    _meta: {
                        'openai/outputTemplate': widgetHtml,
                    },
                };
            }
            case 'get_posts': {
                const limit = args?.limit;
                const result = await getPosts(limit);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case 'create_post': {
                const { title, content, author } = args;
                if (!title || !content) {
                    throw new Error('Title and content are required');
                }
                const result = await createPost(title, content, author);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Personal Website MCP server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
