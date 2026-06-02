import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
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
import type { Todo } from '@/api/client';
import { cn } from '@/lib/utils';

interface Props {
  todo: Todo;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}

export function TodoRow({
  todo,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: Props) {
  return (
    <li
      className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
      data-testid="todo-row"
    >
      <Checkbox
        checked={todo.completed}
        disabled={isToggling}
        onCheckedChange={(v) => onToggle(v === true)}
        aria-label={`Mark "${todo.title}" as ${
          todo.completed ? 'not done' : 'done'
        }`}
        data-testid="todo-toggle"
      />
      <Link
        to={`/todos/${todo.id}`}
        className={cn(
          'flex-1 truncate text-sm hover:underline',
          todo.completed && 'text-muted-foreground line-through',
        )}
        data-testid="todo-title"
      >
        {todo.title}
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete todo"
            disabled={isDeleting}
            data-testid="todo-delete"
          >
            <Trash2 className="h-4 w-4" />
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
              data-testid="todo-delete-confirm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
