import { z } from "zod";

// Domain Models
export const PostStatusSchema = z.enum([
  "published",
  "draft",
  "coming-soon",
  "archived",
]);

export const PostTypeSchema = z.enum(["blog", "playbook"]);

export const PostMetadataSchema = z.object({
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

export const PostSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  type: PostTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  content: z.string(),
  author: z.string(),
  date: z.string(), // ISO date string YYYY-MM-DD
  status: PostStatusSchema,
  readTime: z.string().optional(),
  metadata: PostMetadataSchema.optional(),
  created_by: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Post = z.infer<typeof PostSchema>;

// Tool Input Schemas

export const GetPostsInputSchema = z.object({
  limit: z.number().min(1).max(50).default(10).optional(),
  offset: z.number().min(0).default(0).optional(),
  type: PostTypeSchema.optional(),
});

export const CreatePostInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: PostTypeSchema,
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(), // Optional, can be auto-generated
  description: z.string().optional(),
  status: PostStatusSchema.default("draft"),
  metadata: PostMetadataSchema.optional(),
});

export const GetPostBySlugInputSchema = z.object({
  slug: z.string(),
});

export const DeletePostInputSchema = z.object({
  slug: z.string(),
});

export type GetPostsInput = z.infer<typeof GetPostsInputSchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
