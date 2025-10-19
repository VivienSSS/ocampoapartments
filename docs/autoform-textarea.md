# Textarea Field for AutoForm

This document explains how to use the new `textarea` field type in AutoForm.

## Overview

A new `TextareaField` component has been added to the AutoForm library, allowing you to render multi-line text inputs using the `Textarea` component from shadcn/ui.

## Usage

To use a textarea field in your AutoForm schema, use the `fieldConfig` function with `fieldType: "textarea"`:

```typescript
import { z } from "zod";
import { fieldConfig } from "@autoform/zod";

const schema = z.object({
  description: z.string().check(fieldConfig({ 
    label: "Description",
    description: "Enter a detailed description",
    fieldType: "textarea" 
  })),
  content: z.string().check(fieldConfig({ 
    label: "Content",
    fieldType: "textarea" 
  })),
});
```

## Example

Here's a complete example of using the textarea field:

```typescript
import { AutoForm } from "@/components/ui/autoform";
import { ZodProvider } from "@autoform/zod";
import { fieldConfig } from "@autoform/zod";
import { z } from "zod";

const exampleSchema = z.object({
  title: z.string().check(fieldConfig({ 
    label: "Title" 
  })),
  description: z.string().check(fieldConfig({ 
    label: "Description",
    fieldType: "textarea" 
  })),
});

export function MyForm() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <AutoForm
      schema={new ZodProvider(exampleSchema)}
      onSubmit={handleSubmit}
      withSubmit
    />
  );
}
```

## Features

- Uses the shadcn/ui `Textarea` component
- Supports all standard textarea props through `inputProps`
- Applies error styling when validation fails
- Integrates seamlessly with AutoForm's field system
- Supports all AutoForm field configuration options

## Available Field Types

After adding the textarea field, the following field types are now available:

- `string` - Regular text input (default for strings)
- `number` - Number input
- `boolean` - Checkbox
- `date` - Date picker
- `select` - Select dropdown
- `file` - File upload
- `relation` - Relation picker
- `textarea` - Multi-line text input (new!)

## Styling

The textarea field inherits all styling from the shadcn/ui `Textarea` component and applies error styling automatically when validation fails.