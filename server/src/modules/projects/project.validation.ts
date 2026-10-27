import { z } from "zod";

export const projectSchema = z.object({
  projectName: z
    .string({ error: "Project name is required" })
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name must not exceed 100 characters"),

  repositoryUrl: z
    .string({ error: "Repository URL is required" })
    .trim()
    .min(1, "Repository URL is required")
    .url("Invalid repository URL"),

  liveUrl: z
    .string({ error: "Live URL is required" })
    .trim()
    .min(1, "Live URL is required")
    .url("Invalid live URL"),

  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must not exceed 2000 characters"),
});
