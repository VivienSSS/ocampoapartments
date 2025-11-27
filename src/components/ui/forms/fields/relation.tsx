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
import { usePocketbase } from '@/pocketbase/context';

export interface RelationItem {
  id: string;
  [key: string]: unknown;
}

export type RelationFieldProps<Records extends RelationItem> = {
  relationshipName: string;
  collection: Collections;
  preload?: boolean;
  placeholder?: string;
  displayFields?: (keyof Records)[];
  filterFields?: (keyof Records)[];
};

const RelationField = <Records extends RelationItem>(
  props: RelationFieldProps<Records>,
) => {
  const pocketbase = usePocketbase();

  const field = useFieldContext<string>();
  const {
    collection: collectionName,
    relationshipName,
    displayFields = ['name'],
    preload = false,
    placeholder = 'Search...',
    filterFields,
  } = props;

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
    <AsyncSelect<Records>
      fetcher={fetcher}
      preload={preload}
      renderOption={renderDisplayValue}
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
  );
};

export default RelationField;
