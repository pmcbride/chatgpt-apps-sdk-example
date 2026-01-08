import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";
import { PostService } from "./services/PostService.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CreatePostInputSchema, GetPostsInputSchema, DeletePostInputSchema, } from "./schemas/post.schema.js";
import dotenv from "dotenv";
dotenv.config();
const WEBSITE_URL = process.env.WEBSITE_URL || "https://pmmcbride.com";
const postService = new PostService();
// Tool definitions
const TOOLS = [
    {
        name: "scrape_posts",
        description: "Scrape blog posts directly from pmmcbride.com website HTML (fallback method)",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "get_posts",
        description: "Get blog posts from the pmmcbride.com API",
        inputSchema: zodToJsonSchema(GetPostsInputSchema),
    },
    {
        name: "create_post",
        description: "Create a new blog or playbook post",
        inputSchema: zodToJsonSchema(CreatePostInputSchema),
    },
    {
        name: "delete_post",
        description: "Delete (archive) a post by slug",
        inputSchema: zodToJsonSchema(DeletePostInputSchema),
    },
];
// Helper function to scrape posts from the website (Legacy/Fallback)
async function scrapePosts() {
    try {
        const response = await fetch(WEBSITE_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ChatGPT-MCP-Bot/1.0)",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        const posts = [];
        // Try to find blog posts
        $("article, .post, .blog-post").each((i, elem) => {
            const $elem = $(elem);
            const title = $elem
                .find("h1, h2, h3, .title, .post-title")
                .first()
                .text()
                .trim();
            const content = $elem
                .find("p, .content, .post-content")
                .first()
                .text()
                .trim();
            const link = $elem.find("a").first().attr("href");
            if (title) {
                posts.push({
                    title,
                    content: content || "No content preview available",
                    link: link
                        ? link.startsWith("http")
                            ? link
                            : `${WEBSITE_URL}${link}`
                        : null,
                });
            }
        });
        return posts.length > 0
            ? posts
            : [
                {
                    title: "No posts found via scraping",
                    content: "Please try using the get_posts API tool instead.",
                    link: WEBSITE_URL,
                },
            ];
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Scraping error:", errorMessage);
        return [
            {
                title: "Unable to scrape website",
                content: `Error: ${errorMessage}.`,
                link: WEBSITE_URL,
            },
        ];
    }
}
// Create MCP server
const server = new Server({
    name: "personal-website-mcp",
    version: "1.0.0",
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
            case "scrape_posts": {
                const posts = await scrapePosts();
                return {
                    content: [{ type: "text", text: JSON.stringify(posts, null, 2) }],
                };
            }
            case "get_posts": {
                // Zod validation optional here if we trust the inputSchema,
                // but strict parsing is better
                const input = GetPostsInputSchema.parse(args);
                const result = await postService.getPosts(input);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "create_post": {
                const input = CreatePostInputSchema.parse(args);
                const result = await postService.createPost(input);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "delete_post": {
                const input = DeletePostInputSchema.parse(args);
                await postService.deletePost(input.slug);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Successfully deleted (archived) post: ${input.slug}`,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});
// Main entry point
async function main() {
    const mode = process.argv.includes("mode=http") ? "http" : "stdio";
    if (mode === "http") {
        const app = express();
        const PORT = process.env.PORT || 3000;
        app.use(cors());
        // Health check
        app.get("/health", (req, res) => res.json({ status: "ok" }));
        // Streamable HTTP Transport
        const transport = new StreamableHTTPServerTransport();
        app.all("/mcp", async (req, res) => {
            await transport.handleRequest(req, res, req.body);
        });
        await server.connect(transport);
        app.listen(PORT, () => {
            console.log(`MCP Server running on HTTP port ${PORT}`);
            console.log(`MCP Endpoint: http://localhost:${PORT}/mcp`);
        });
    }
    else {
        // STDIO Transport (Default)
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("MCP Server running on stdio");
    }
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
