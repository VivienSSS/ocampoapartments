import { Collections } from '@/pocketbase/types';
import z from 'zod';

export const FieldLegendSchema = z.object({
  variant: z.enum(['legend', 'label']).default('legend'),
  text: z.string().optional().meta({
    title: 'Legend Text',
    description: 'The text of the fieldset legend',
    example: 'Personal Information',
  }),
});

// Config schemas for each field type
const BoolConfigSchema = z.object({}).optional();

const NumberConfigSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  })
  .optional();

const TextConfigSchema = z
  .object({
    placeholder: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
  })
  .optional();

const SelectConfigSchema = z.object({
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});

const FileConfigSchema = z.record(z.string(), z.any()).optional();

const RelationConfigSchema = z.object({
  collection: z.enum(Collections),
  displayField: z.string(),
  relationshipName: z.string(),
});

const CommonFieldProps = {
  name: z.string().meta({
    title: 'Field Name',
    description: 'The name of the field in the form data',
    example: 'email',
  }),
  orientation: z
    .enum(['horizontal', 'vertical', 'responsive'])
    .default('vertical')
    .meta({
      title: 'Orientation',
      description: 'The orientation of the field',
      example: 'vertical',
    }),
  label: z.string().optional().meta({
    title: 'Label',
    description: 'The label of the field',
    example: 'Email Address',
  }),
  description: z.string().optional().meta({
    title: 'Description',
    description: 'The description of the field',
    example: 'Please enter your email address',
  }),
  title: z.string().optional().meta({
    title: 'Title',
    description: 'The title of the field',
    example: 'Personal Information',
  }),
  separator: z
    .union([z.string(), z.boolean()])
    .optional()
    .meta({
      title: 'Separator',
      description: 'The separator of the field',
      example: [true, false, 'Section'],
    }),
};

export const FieldSchema = z.discriminatedUnion('type', [
  z.object({
    ...CommonFieldProps,
    type: z.literal('bool'),
    config: BoolConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('number'),
    config: NumberConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('text'),
    config: TextConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('email'),
    config: TextConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('url'),
    config: TextConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('textarea'),
    config: TextConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('date'),
    config: z.object({}).optional(),
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('select'),
    config: SelectConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('file'),
    config: FileConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('relation'),
    config: RelationConfigSchema,
  }),
  z.object({
    ...CommonFieldProps,
    type: z.literal('json'),
    config: z.record(z.string(), z.any()).optional(),
  }),
]);

export const FieldSetSchema = z.object({
  legend: FieldLegendSchema.optional(),
  groups: z.array(FieldSchema),
});
