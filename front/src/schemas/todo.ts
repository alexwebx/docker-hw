import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Max 255 chars'),
});
export type CreateTodoValues = z.infer<typeof createTodoSchema>;

export const editTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Max 255 chars'),
  description: z.string().max(2000, 'Max 2000 chars').optional(),
  completed: z.boolean(),
});
export type EditTodoValues = z.infer<typeof editTodoSchema>;
