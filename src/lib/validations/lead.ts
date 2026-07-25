import { z } from "zod";

export const budgetRanges = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $20,000",
  "$20,000+",
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  budgetRange: z.enum(budgetRanges, {
    message: "Please select a budget range",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be under 1000 characters"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;