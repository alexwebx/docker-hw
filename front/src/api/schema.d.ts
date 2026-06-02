/**
 * Placeholder OpenAPI types so the frontend type-checks before the backend is up.
 * Regenerate by running `npm run gen:api` (the backend must be running locally).
 */

export interface paths {
  '/todos': {
    get: {
      responses: {
        200: { content: { 'application/json': components['schemas']['Todo'][] } };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': components['schemas']['CreateTodoDto'];
        };
      };
      responses: {
        201: { content: { 'application/json': components['schemas']['Todo'] } };
      };
    };
  };
  '/todos/{id}': {
    get: {
      parameters: { path: { id: string } };
      responses: {
        200: { content: { 'application/json': components['schemas']['Todo'] } };
        404: { content: { 'application/json': components['schemas']['HttpError'] } };
      };
    };
    patch: {
      parameters: { path: { id: string } };
      requestBody: {
        content: {
          'application/json': components['schemas']['UpdateTodoDto'];
        };
      };
      responses: {
        200: { content: { 'application/json': components['schemas']['Todo'] } };
        400: { content: { 'application/json': components['schemas']['HttpError'] } };
        404: { content: { 'application/json': components['schemas']['HttpError'] } };
      };
    };
    delete: {
      parameters: { path: { id: string } };
      responses: {
        204: { content: { 'application/json': never } };
        404: { content: { 'application/json': components['schemas']['HttpError'] } };
      };
    };
  };
}

export interface components {
  schemas: {
    Todo: {
      id: string;
      title: string;
      description: string | null;
      completed: boolean;
      createdAt: string;
      updatedAt: string;
    };
    CreateTodoDto: {
      title: string;
      description?: string;
    };
    UpdateTodoDto: {
      title?: string;
      description?: string | null;
      completed?: boolean;
    };
    HttpError: {
      statusCode: number;
      message: string | string[];
      error?: string;
    };
  };
}
