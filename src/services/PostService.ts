import { v4 as uuidv4 } from "uuid";
import {
  Post,
  CreatePostInput,
  GetPostsInput,
  PostSchema,
} from "../schemas/post.schema.js";

const USE_MOCK =
  process.env.USE_MOCK_API === "true" || !process.env.MCP_API_URL;
const API_URL = process.env.MCP_API_URL || "https://api.pmmcbride.com/v1";
const API_KEY = process.env.API_KEY;

// Mock Data Store
const mockPosts: Post[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    slug: "hello-world",
    type: "blog",
    title: "Hello World from Mock",
    content: "This is a mock post content.",
    description: "A mock post for testing.",
    author: "Patrick McBride",
    date: "2024-01-01",
    status: "published",
    readTime: "5 min",
    metadata: { tags: ["mock", "test"] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class PostService {
  async getPosts(params: GetPostsInput): Promise<Post[]> {
    if (USE_MOCK) {
      return mockPosts.slice(
        params.offset || 0,
        (params.offset || 0) + (params.limit || 10)
      );
    }

    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.offset) query.append("offset", params.offset.toString());
    if (params.type) query.append("type", params.type);

    const response = await fetch(`${API_URL}/posts?${query.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Post[]; // Assuming API validation happens on the other side, but we could parse with Zod here too
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    if (USE_MOCK) {
      return mockPosts.find((p) => p.slug === slug) || null;
    }

    const response = await fetch(`${API_URL}/posts/${slug}`, {
      headers: { Accept: "application/json" },
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    return (await response.json()) as Post;
  }

  async createPost(input: CreatePostInput): Promise<Post> {
    if (USE_MOCK) {
      const newPost: Post = {
        id: uuidv4(),
        slug: input.slug || input.title.toLowerCase().replace(/\s+/g, "-"),
        type: input.type,
        title: input.title,
        content: input.content,
        description: input.description,
        author: "MCP User",
        date: new Date().toISOString().split("T")[0],
        status: input.status || "draft",
        metadata: input.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockPosts.push(newPost);
      return newPost;
    }

    if (!API_KEY) {
      throw new Error("API Key is required for creating posts");
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return (await response.json()) as Post;
  }

  async deletePost(slug: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockPosts.findIndex((p) => p.slug === slug);
      if (index !== -1) mockPosts.splice(index, 1);
      return;
    }

    if (!API_KEY) throw new Error("API Key configuration missing");

    const response = await fetch(`${API_URL}/posts/${slug}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    if (!response.ok)
      throw new Error(`Failed to delete post: ${response.statusText}`);
  }
}
