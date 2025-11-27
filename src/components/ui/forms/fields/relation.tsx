import type React from 'react';
import { useCallback } from 'react';
import type { Collections } from '@/pocketbase/types';
import { AsyncSelect } from '../../async-select';
import { Field, FieldDescription, FieldError } from '../../field';
import { useFieldContext } from '..';
import { usePocketbase } from '@/pocketbase/context';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export interface RelationItem {
  id: string;
  [key: string]: unknown;
}

export type RelationFieldProps<Records extends RelationItem> = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  relationshipName: string;
  collection: Collections;
  preload?: boolean;
  placeholder?: string;
  displayFields?: (keyof Records)[];
  filterFields?: (keyof Records)[];
  renderOption?: (item: Records) => React.ReactNode;
};

const RelationField = <Records extends RelationItem>(
  props: RelationFieldProps<Records>,
) => {
  const pocketbase = usePocketbase();

  const field = useFieldContext<string>();
  const {
    label,
    description,
    tooltip,
    tooltipSide,
    collection: collectionName,
    relationshipName,
    displayFields = ['name'],
    preload = false,
    placeholder = 'Search...',
    filterFields,
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Fetcher function to query related records
  const fetcher = useCallback(
    async (query?: string): Promise<Records[]> => {
      try {
        const filter = query
          ? filterFields
            ? filterFields
                .map((field) => `${String(field)}~"${query}"`)
                .join(' || ')
            : `name~"${query}"`
          : '';

        const records = await pocketbase
          .collection(collectionName)
          .getList(1, 50, {
            filter,
          });

        return records.items as unknown as Records[];
      } catch (error) {
        console.error('Failed to fetch relation records:', error);
        return [];
      }
    },
    [pocketbase, collectionName, filterFields],
  );

  const renderDisplayValue = (item: Records) =>
    displayFields.map((field) => String(item[field])).join(', ');

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel tooltip={tooltip} tooltipSide={tooltipSide}>
        {label}
      </TooltipFieldLabel>
      <AsyncSelect<Records>
        fetcher={fetcher}
        preload={preload}
        renderOption={
          props.renderOption ? props.renderOption : renderDisplayValue
        }
        getOptionValue={(item) => item.id}
        getDisplayValue={renderDisplayValue}
        label={relationshipName}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={field.handleChange}
        notFound={
          <div className="py-6 text-center text-sm">No records found</div>
        }
        clearable={true}
      />
      <FieldDescription>{description}</FieldDescription>
      <FieldError errors={field.state.meta.errorMap.onSubmit} />
    </Field>
  );
};

export default RelationField;
