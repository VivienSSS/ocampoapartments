import { useAppForm } from '@/components/ui/forms';
import { formOptions } from '@tanstack/react-form';
import {
  useNavigate,
  useRouteContext,
  useSearch,
  type UseNavigateResult,
} from '@tanstack/react-router';
import React, { useEffect } from 'react';
import type z from 'zod';
import { announcementSchema } from '../schemas/announcements';
import {
  Collections,
  type CollectionResponses,
  type Create,
  type TypedPocketBase,
} from '../types';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { CreateRecordMutationOption } from '../mutation';
import AutoFieldSet from '@/components/ui/autoform';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FieldSeparator } from '@/components/ui/field';

export const CreateSchema = announcementSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const CreateAnnouncementFormOption = (pocketbase: TypedPocketBase) =>
  formOptions({
    defaultValues: {
      author: pocketbase.authStore.record?.id,
    } as Create<Collections.Announcements>,
    validators: {
      onSubmit: CreateSchema,
    },
    onSubmitMeta: {} as {
      navigate: UseNavigateResult<'/dashboard/$collection'>;
      mutator: UseMutationResult<
        CollectionResponses['announcements'],
        unknown,
        Create<Collections.Announcements>,
        unknown
      >;
    },
    onSubmit: async ({ value, meta }) =>
      meta.mutator.mutateAsync(value, {
        onSettled: () => {
          meta.navigate({
            search: (prev) => ({
              ...prev,
              action: undefined,
            }),
          });
        },
      }),
  });

export const AnnouncementForm = () => {
  const navigate = useNavigate({ from: '/dashboard/$collection' });
  const searchQuery = useSearch({ from: '/dashboard/$collection' });
  const { pocketbase } = useRouteContext({ from: '/dashboard/$collection' });

  const createMutation = useMutation(
    CreateRecordMutationOption(pocketbase, Collections.Announcements),
  );

  const form = useAppForm(CreateAnnouncementFormOption(pocketbase));

  if (searchQuery.action === 'create') {
    return (
      <>
        <DialogTitle>Create Announcement</DialogTitle>
        <DialogDescription>
          Fill out the form below to create a new announcement.
        </DialogDescription>
        <FieldSeparator />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit({ navigate, mutator: createMutation });
          }}
        >
          <form.AppForm>
            <AutoFieldSet
              form={form}
              schema={{
                groups: [
                  {
                    type: 'text',
                    name: 'title',
                    label: 'Announcement Title',
                    orientation: 'vertical',
                    description: 'Enter the title of the announcement',
                  },
                  {
                    type: 'textarea',
                    name: 'description',
                    orientation: 'vertical',
                    label: 'Announcement Description',
                    description: 'Enter the description of the announcement',
                  },
                ],
              }}
            />
          </form.AppForm>
        </form>
      </>
    );
  }
};
