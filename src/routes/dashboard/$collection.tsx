import PocketbaseForms from '@/pocketbase/forms';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

export const Route = createFileRoute('/dashboard/$collection')({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      action: z.string().optional(),
      id: z.string().optional(),
    }),
  ),
});

function RouteComponent() {
  return (
    <div>
      <PocketbaseForms />
    </div>
  );
}
