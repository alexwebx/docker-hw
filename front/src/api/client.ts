import createClient from 'openapi-fetch';
import type { paths, components } from './schema';

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});

export type Todo = components['schemas']['Todo'];
export type CreateTodoInput = components['schemas']['CreateTodoDto'];
export type UpdateTodoInput = components['schemas']['UpdateTodoDto'];

export interface NestValidationError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export function isValidationError(
  err: unknown,
): err is NestValidationError & { message: string[] } {
  return (
    !!err &&
    typeof err === 'object' &&
    'statusCode' in err &&
    (err as NestValidationError).statusCode === 400 &&
    Array.isArray((err as NestValidationError).message)
  );
}

export function errorMessage(err: unknown): string {
  if (!err) return 'Unknown error';
  if (typeof err === 'object' && 'message' in err) {
    const m = (err as NestValidationError).message;
    return Array.isArray(m) ? m.join(', ') : String(m);
  }
  return 'Unknown error';
}
