import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage({ message }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-24 text-center"
      data-testid="not-found"
    >
      <h2 className="text-2xl font-semibold">Not found</h2>
      <p className="text-muted-foreground">
        {message ?? "The page you're looking for doesn't exist."}
      </p>
      <Button asChild>
        <Link to="/">Back to todos</Link>
      </Button>
    </div>
  );
}
