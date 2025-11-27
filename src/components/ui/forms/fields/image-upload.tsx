'use client';

import type React from 'react';
import { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../button';
import { Card, CardContent } from '../../card';
import { Dropzone, DropzoneEmptyState } from '../../kibo-ui/dropzone';
import { Field, FieldDescription, FieldError } from '../../field';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';
import { cn } from '@/lib/utils';

export type ImageUploadFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  multiple?: boolean;
  className?: string;
};

const ImageUploadField = ({
  label,
  description,
  tooltip,
  tooltipSide = 'top',
  multiple = false,
  className,
}: ImageUploadFieldProps) => {
  const field = useFieldContext<File | File[]>();
  const [previews, setPreviews] = useState<string[]>([]);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = field.state.value;

  const currentFiles = Array.isArray(value) ? value : value ? [value] : [];

  const handleDrop = (files: File[]) => {
    if (multiple) {
      const newFiles = [...currentFiles, ...files];
      field.setValue(newFiles as any);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            setPreviews((prev) => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      field.setValue(files[0] as any);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setPreviews([e.target?.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      field.setValue(newFiles as any);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      field.setValue(undefined as any);
      setPreviews([]);
    }
  };

  return (
    <Field data-invalid={isInvalid} className={className}>
      <TooltipFieldLabel
        htmlFor={field.name}
        tooltip={tooltip}
        tooltipSide={tooltipSide}
      >
        {label}
      </TooltipFieldLabel>

      <div className="space-y-4 w-full">
        {/* Upload Area */}
        <Dropzone
          maxFiles={multiple ? 10 : 1}
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
          onDrop={handleDrop}
          onError={console.error}
          src={currentFiles}
        >
          <Card className="border-2 hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer w-full">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <DropzoneEmptyState />
              </div>
            </CardContent>
          </Card>
        </Dropzone>

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div
            className={cn(
              'grid gap-3',
              multiple
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1',
            )}
          >
            {previews.map((preview, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="gap-1"
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                </div>

                {/* Image Badge */}
                {!multiple && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <ImageIcon size={12} />
                    Main
                  </div>
                )}

                {multiple && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Empty State Message */}
        {previews.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <ImageIcon className="mx-auto mb-2 opacity-40" size={24} />
            <p className="text-sm">No images uploaded yet</p>
            <p className="text-xs text-muted-foreground/70">
              Drag and drop or click to upload
            </p>
          </div>
        )}
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError errors={field.state.meta.errorMap.onSubmit} />
    </Field>
  );
};

export default ImageUploadField;
