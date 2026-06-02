import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  apiClient,
  type CreateTodoInput,
  type Todo,
  type UpdateTodoInput,
} from './client';

const todosKey = ['todos'] as const;
const todoKey = (id: string) => ['todos', id] as const;

export function useTodos() {
  return useQuery({
    queryKey: todosKey,
    queryFn: async (): Promise<Todo[]> => {
      const { data, error } = await apiClient.GET('/todos');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTodo(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: id ? todoKey(id) : ['todos', 'unknown'],
    queryFn: async (): Promise<Todo> => {
      const { data, error } = await apiClient.GET('/todos/{id}', {
        params: { path: { id: id! } },
      });
      if (error) {
        if (isHttpStatus(error, 404)) throw new NotFoundError();
        throw error;
      }
      return data!;
    },
    retry: (failureCount, err) => {
      if (err instanceof NotFoundError) return false;
      return failureCount < 1;
    },
  });
}

function isHttpStatus(err: unknown, status: number): boolean {
  return (
    !!err &&
    typeof err === 'object' &&
    'statusCode' in err &&
    (err as { statusCode: unknown }).statusCode === status
  );
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateTodoInput) => {
      const { data, error } = await apiClient.POST('/todos', { body });
      if (error) throw error;
      return data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todosKey });
    },
  });
}

export function useUpdateTodo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateTodoInput) => {
      const { data, error } = await apiClient.PATCH('/todos/{id}', {
        params: { path: { id } },
        body,
      });
      if (error) throw error;
      return data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todosKey });
      qc.invalidateQueries({ queryKey: todoKey(id) });
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE('/todos/{id}', {
        params: { path: { id } },
      });
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: todosKey });
      qc.removeQueries({ queryKey: todoKey(id) });
    },
  });
}

export class NotFoundError extends Error {
  constructor() {
    super('Not found');
    this.name = 'NotFoundError';
  }
}
