import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Trash2 } from 'lucide-react';
import { NotFoundError, useDeleteTodo, useTodo, useUpdateTodo } from '@/api/todos';
import { editTodoSchema, type EditTodoValues } from '@/schemas/todo';
import { errorMessage, isValidationError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { NotFoundPage } from './not-found';
import { toast } from '@/components/ui/sonner';

export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: todo, isLoading, isError, error, refetch } = useTodo(id);
  const updateTodo = useUpdateTodo(id ?? '');
  const deleteTodo = useDeleteTodo();

  const form = useForm<EditTodoValues>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: { title: '', description: '', completed: false },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        description: todo.description ?? '',
        completed: todo.completed,
      });
    }
  }, [todo, form]);

  if (error instanceof NotFoundError) {
    return <NotFoundPage message="That todo doesn't exist." />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (!id) return;
    try {
      await updateTodo.mutateAsync({
        title: values.title,
        description: values.description?.length ? values.description : null,
        completed: values.completed,
      });
      toast.success('Saved');
    } catch (err) {
      if (isValidationError(err)) {
        for (const msg of err.message) {
          const field = msg.split(' ')[0] as keyof EditTodoValues;
          if (['title', 'description', 'completed'].includes(field)) {
            form.setError(field, { message: msg });
          }
        }
        if (form.formState.errors.title || form.formState.errors.description)
          return;
        toast.error('Failed to save todo', { description: err.message.join(', ') });
      } else {
        toast.error('Failed to save todo', { description: errorMessage(err) });
      }
    }
  });

  const onDelete = async () => {
    if (!id) return;
    try {
      await deleteTodo.mutateAsync(id);
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete todo', { description: errorMessage(err) });
    }
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      {isLoading && (
        <div className="space-y-4" data-testid="detail-loading">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}

      {isError && !(error instanceof NotFoundError) && (
        <Card className="p-4 text-sm" role="alert" data-testid="detail-error">
          <p className="font-medium text-destructive">Failed to load todo.</p>
          <p className="text-muted-foreground">{errorMessage(error)}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </Card>
      )}

      {todo && (
        <form
          onSubmit={onSubmit}
          className="space-y-4"
          data-testid="detail-form"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              data-testid="detail-title"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p
                className="text-sm text-destructive"
                data-testid="detail-title-error"
              >
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              data-testid="detail-description"
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="completed"
              checked={form.watch('completed')}
              onCheckedChange={(v) => form.setValue('completed', v === true)}
              data-testid="detail-completed"
            />
            <Label htmlFor="completed">Completed</Label>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              type="submit"
              disabled={updateTodo.isPending}
              data-testid="detail-save"
            >
              {updateTodo.isPending && <Loader2 className="animate-spin" />}
              Save
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleteTodo.isPending}
                  data-testid="detail-delete"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    "{todo.title}" will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    data-testid="detail-delete-confirm"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      )}
    </div>
  );
}
