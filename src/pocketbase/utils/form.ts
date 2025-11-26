import type z from 'zod';
import type {
  FieldSchema,
  FieldSetSchema,
} from '@/components/ui/autoform/schema';
import type { FormsOperationOptions, FormsRecord } from '../types';

export const schemaToForm = (
  collection: string,
  data: FormsRecord[],
  operation: FormsOperationOptions,
): z.infer<typeof FieldSetSchema> => {
  const fields = data
    .filter((row) => row.collection === collection)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const groups: z.infer<typeof FieldSchema>[] = [];

  for (const field of fields) {
    if (!field.operation?.includes(operation)) {
      continue;
    }

    groups.push({
      label: field.label,
      name: field.name,
      // biome-ignore lint/suspicious/noExplicitAny: acceptable type
      type: field.type as any,
      description: field.description,
      // biome-ignore lint/suspicious/noExplicitAny: acceptable type
      orientation: (field.orientation as any) || 'vertical',
      // biome-ignore lint/suspicious/noExplicitAny: acceptable
      config: field.config as any,
      separator: field.separator,
    });
  }

  return {
    groups,
  };
};
