import { request, type APIRequestContext } from '@playwright/test';

const API = process.env.E2E_API_URL ?? 'http://localhost:3000';

/**
 * Wipe all todos via the API so each test starts from a clean state.
 * Single-user app — no auth needed.
 */
export async function resetTodos(api?: APIRequestContext) {
  const ctx = api ?? (await request.newContext({ baseURL: API }));
  const res = await ctx.get('/todos');
  if (!res.ok()) {
    throw new Error(`Failed to list todos: ${res.status()}`);
  }
  const todos: Array<{ id: string }> = await res.json();
  for (const t of todos) {
    await ctx.delete(`/todos/${t.id}`);
  }
  if (!api) await ctx.dispose();
}

export async function createTodoViaApi(
  title: string,
  description?: string,
): Promise<{ id: string; title: string; description: string | null }> {
  const ctx = await request.newContext({ baseURL: API });
  const res = await ctx.post('/todos', {
    data: { title, ...(description ? { description } : {}) },
  });
  if (!res.ok()) {
    throw new Error(`Failed to create todo: ${res.status()}`);
  }
  const json = await res.json();
  await ctx.dispose();
  return json;
}
