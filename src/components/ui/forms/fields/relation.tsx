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
import { useRouteContext } from '@tanstack/react-router';

export interface RelationItem {
  id: string;
  [key: string]: unknown;
}

export type RelationFieldProps<Records extends RelationItem> = {
  relationshipName: string;
  collection: Collections;
  displayField?: string;
  preload?: boolean;
  placeholder?: string;
  pocketbase?: TypedPocketBase;
  renderOption?: (item: Records) => React.ReactNode;
  recordListOption?: Omit<RecordListOptions, 'filter'> & {
    filter?: string | ((query?: string) => string);
  };
};

const RelationField = <Records extends RelationItem>(
  props: RelationFieldProps<Records>,
) => {
  const { pocketbase } = useRouteContext({ from: '/dashboard/$collection' });

  const field = useFieldContext<string>();
  const {
    collection: collectionName,
    relationshipName,
    displayField = 'name',
    preload = false,
    placeholder = 'Search...',
  } = props;

  // Fetcher function to query related records
  const fetcher = useCallback(
    async (query?: string): Promise<Records[]> => {
      try {
        const filter =
          typeof props.recordListOption?.filter === 'function'
            ? props.recordListOption.filter?.(query)
            : props.recordListOption?.filter;

        const records = await pocketbase
          .collection(collectionName)
          .getList(1, 50, {
            ...props.recordListOption,
            filter,
          });

        return records.items as unknown as Records[];
      } catch (error) {
        console.error('Failed to fetch relation records:', error);
        return [];
      }
    },
    [pocketbase, collectionName, props.recordListOption],
  );

  return (
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
      label={relationshipName}
      placeholder={placeholder}
      value={field.state.value ?? ''}
      onChange={field.handleChange}
      notFound={
        <div className="py-6 text-center text-sm">No records found</div>
      }
      clearable={true}
    />
  );
};

export default RelationField;
