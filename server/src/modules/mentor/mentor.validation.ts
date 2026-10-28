import { z } from "zod";

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    error: "Status must be APPROVED or REJECTED",
  }),
  reviewNote: z
    .string()
    .trim()
    .max(1000, "Review note must not exceed 1000 characters")
    .optional(),
});
