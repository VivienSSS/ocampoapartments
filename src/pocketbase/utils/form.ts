import type z from 'zod';
import schema from '../../../public/schema.json';
import type {
  FieldSchema,
  FieldSetSchema,
} from '@/components/ui/autoform/schema';
import type { RelationFieldProps } from '@/components/ui/forms/fields/relation';
import type { RecordModel } from 'pocketbase';

export const schemaToForm = (
  collection: string,
): z.infer<typeof FieldSetSchema> => {
  const table = schema.find((table) => table.name === collection);

  const groups: z.infer<typeof FieldSchema>[] = [];

  for (const field of table?.fields || []) {
    if (field.primaryKey) {
      continue;
    }

    if (field.type === 'autodate') {
      continue;
    }

    switch (field.type) {
      case 'text':
        groups.push({
          label: field.name,
          name: field.name,
          type: field.type as any,
          description: 'Enter text value',
          orientation: 'vertical',
        });
        break;
      case 'select':
        groups.push({
          label: field.name,
          name: field.name,
          type: field.type as any,
          description: 'Select 1 option',
          orientation: 'vertical',
          config: {
            //@ts-ignore
            options: field.values.map((variant) => ({
              label: variant,
              value: variant,
            })),
          },
        });
        break;
      case 'number':
        groups.push({
          label: field.name,
          name: field.name,
          type: field.type as any,
          orientation: 'vertical',
        });
        break;
      case 'relation': {
        const relTable = schema.find(
          //@ts-ignore
          (table) => table.id === field.collectionId,
        );

        const presentableFields =
          relTable?.fields.filter((f) => f.presentable) ?? [];

        groups.push({
          label: field.name,
          name: field.name,
          type: field.type as any,
          orientation: 'vertical',
          config: {
            //@ts-ignore
            collection: field.collectionId,
            relationshipName: field.name,
            renderOption: (item: RecordModel) => {
              return presentableFields.map((f) => item[f.name]).join(', ');
            },
          } as RelationFieldProps<RecordModel>,
        });
        break;
      }
    }
  }

  return {
    groups,
  };
};
