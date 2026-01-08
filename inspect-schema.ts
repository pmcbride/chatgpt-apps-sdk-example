import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CreatePostInputSchema,
  GetPostsInputSchema,
  DeletePostInputSchema,
} from "./src/schemas/post.schema.js";

console.log("GetPostsInputSchema:");
console.log(JSON.stringify(zodToJsonSchema(GetPostsInputSchema), null, 2));

console.log("\nCreatePostInputSchema:");
console.log(JSON.stringify(zodToJsonSchema(CreatePostInputSchema), null, 2));
