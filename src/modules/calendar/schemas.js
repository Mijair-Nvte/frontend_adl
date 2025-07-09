import { z } from "zod";

// Esquema de validación para un evento
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),

  calendar_group_id: z.union([z.string(), z.number()]).optional(),
  case_id: z.union([z.string(), z.number()]).optional(),
  sync_to_google: z.boolean().optional(),
  user_ids: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .default([]),
});
