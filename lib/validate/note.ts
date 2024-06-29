import { z } from "zod";
export const createNoteZodSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
});

export const updateNoteZodSchema = createNoteZodSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteZodSchema = z.object({
  id: z.string().min(1),
});
export type ICreateNodeSchema = z.infer<typeof createNoteZodSchema>;
