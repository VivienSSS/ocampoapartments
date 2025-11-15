import type React from 'react';
import { useCallback } from 'react';
import type {
  BaseSystemFields,
  Collections,
  TypedPocketBase,
} from '@/pocketbase/types';
import { AsyncSelect } from '../../async-select';
import { Field, FieldDescription, FieldError } from '../../field';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';
import type { RecordListOptions } from 'pocketbase';

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
  collectionName: Collections;
  displayField?: string;
  preload?: boolean;
  placeholder?: string;
  pocketbase: TypedPocketBase;
  renderOption?: (item: Records) => React.ReactNode;
  recordListOption?: Omit<RecordListOptions, 'filter'> & {
    filter?: string | ((query?: string) => string)
  };
};

const RelationField = <Records extends RelationItem>(
  props: RelationFieldProps<Records>,
) => {
  const field = useFieldContext<string>();
  const {
    collectionName,
    relationshipName,
    displayField = 'name',
    preload = false,
    placeholder = 'Search...',
  } = props;

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Fetcher function to query related records
  const fetcher = useCallback(
    async (query?: string): Promise<Records[]> => {
      try {
        let filter = typeof props.recordListOption?.filter === "function"
          ? props.recordListOption.filter?.(query)
          : props.recordListOption?.filter

        const records = await props.pocketbase
          .collection(collectionName)
          .getList(1, 50, {
            ...props.recordListOption,
            filter
          });

        return records.items as unknown as Records[];
      } catch (error) {
        console.error('Failed to fetch relation records:', error);
        return [];
      }
    },
    [props.pocketbase, collectionName, props.recordListOption],
  );

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        htmlFor={field.name}
        tooltip={props.tooltip}
        tooltipSide={props.tooltipSide}
      >
        {props.label}
      </TooltipFieldLabel>
      <AsyncSelect<Records>
        fetcher={fetcher}
        preload={preload}
        renderOption={(item) =>
          props.renderOption
            ? props.renderOption(item)
            : String(item[displayField])
        }
        getOptionValue={(item) => item.id}
        getDisplayValue={(item) =>
          props.renderOption
            ? props.renderOption(item)
            : String(item[displayField])
        }
        label={String(props.label || relationshipName)}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={field.handleChange}
        notFound={
          <div className="py-6 text-center text-sm">No records found</div>
        }
        clearable={true}
      />
      <FieldDescription>{props.description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default RelationField;
