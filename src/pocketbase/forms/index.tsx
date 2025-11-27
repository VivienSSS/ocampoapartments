import {
  useNavigate,
  useParams,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { schemaToForm } from '../utils/form';
import AutoFieldSet from '@/components/ui/autoform';
import { useAppForm } from '@/components/ui/forms';
import { type RecordModel } from 'pocketbase';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { BatchDeleteRecordMutationOption } from '../mutation';
import { ViewQueryOption } from '../query';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collections,
  FormsOperationOptions,
  type TypedPocketBase,
} from '../types';
import {
  AnnouncementForm,
  CreateAnnouncementFormOption,
  UpdateAnnouncementFormOption,
} from './announcements';
import {
  ApartmentUnitForm,
  CreateApartmentUnitFormOption,
  UpdateApartmentUnitFormOption,
} from './apartment_units';
import { BillForm, CreateBillFormOption, UpdateBillFormOption } from './bills';
import {
  InquiryForm,
  CreateInquiryFormOption,
  UpdateInquiryFormOption,
} from './inquiries';
import {
  MaintenanceRequestForm,
  CreateMaintenanceRequestFormOption,
  UpdateMaintenanceRequestFormOption,
} from './maintenance_requests';
import {
  MaintenanceWorkerForm,
  CreateMaintenanceWorkerFormOption,
  UpdateMaintenanceWorkerFormOption,
} from './maintenance_workers';
import {
  PaymentForm,
  CreatePaymentFormOption,
  UpdatePaymentFormOption,
} from './payments';
import {
  PropertyForm,
  CreatePropertyFormOption,
  UpdatePropertyFormOption,
} from './properties';
import {
  ScheduleForm,
  CreateScheduleFormOption,
  UpdateScheduleFormOption,
} from './schedules';
import {
  TenancyForm,
  CreateTenancyFormOption,
  UpdateTenancyFormOption,
} from './tenancies';
import {
  TenantForm,
  CreateTenantFormOption,
  UpdateTenantFormOption,
} from './tenants';

const FormOptions = (collection: string, operation: 'create' | 'update') => {
  const allOptions = {
    announcements: {
      create: CreateAnnouncementFormOption,
      update: UpdateAnnouncementFormOption,
      component: AnnouncementForm(),
    },
    apartment_units: {
      create: CreateApartmentUnitFormOption,
      update: UpdateApartmentUnitFormOption,
      component: ApartmentUnitForm(),
    },
    bills: {
      create: CreateBillFormOption,
      update: UpdateBillFormOption,
      component: BillForm(),
    },
    inquiries: {
      create: CreateInquiryFormOption,
      update: UpdateInquiryFormOption,
      component: InquiryForm(),
    },
    maintenance_requests: {
      create: CreateMaintenanceRequestFormOption,
      update: UpdateMaintenanceRequestFormOption,
      component: MaintenanceRequestForm(),
    },
    maintenance_workers: {
      create: CreateMaintenanceWorkerFormOption,
      update: UpdateMaintenanceWorkerFormOption,
      component: MaintenanceWorkerForm(),
    },
    payments: {
      create: CreatePaymentFormOption,
      update: UpdatePaymentFormOption,
      component: PaymentForm(),
    },
    properties: {
      create: CreatePropertyFormOption,
      update: UpdatePropertyFormOption,
      component: PropertyForm(),
    },
    schedules: {
      create: CreateScheduleFormOption,
      update: UpdateScheduleFormOption,
      component: ScheduleForm(),
    },
    tenancies: {
      create: CreateTenancyFormOption,
      update: UpdateTenancyFormOption,
      component: TenancyForm(),
    },
    tenants: {
      create: CreateTenantFormOption,
      update: UpdateTenantFormOption,
      component: TenantForm(),
    },
  };

  const collectionOptions = allOptions[collection as keyof typeof allOptions];
  if (!collectionOptions) {
    return undefined;
  }

  return {
    formOption: collectionOptions[operation],
    Component: collectionOptions.component,
  };
};

const PocketbaseForms = () => {
  const pathParams = useParams({ from: '/dashboard/$collection' });
  const searchQuery = useSearch({ from: '/dashboard/$collection' });
  const navigate = useNavigate({ from: '/dashboard/$collection' });
  const { pocketbase } = useRouteContext({ from: '/dashboard/$collection' });

  // data fetching
  const { data: record } = useQuery(
    ViewQueryOption(
      pocketbase,
      pathParams.collection as Collections,
      searchQuery.selected?.[0],
    ),
  );

  const { formOption, Component } = FormOptions(
    pathParams.collection,
    searchQuery.action === 'create' ? 'create' : 'update',
  )!;

  // delete
  const deleteMutation = useMutation(
    BatchDeleteRecordMutationOption(pocketbase, pathParams.collection as any),
  );

  const form = useAppForm({
    ...formOption,
    defaultValues: searchQuery.selected?.[0] ? record : {},
  } as any);

  if (searchQuery.action === 'delete' && searchQuery.selected) {
    return (
      <AlertDialog
        open={true}
        onOpenChange={() =>
          navigate({
            search: (prev) => ({ ...prev, action: undefined, selected: [] }),
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteMutation.mutate({ ids: searchQuery.selected || [] })
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog
      open={
        !!searchQuery.action &&
        (searchQuery.action === 'create' || searchQuery.action === 'update')
      }
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, action: undefined, selected: [] }),
        })
      }
    >
      <DialogContent
        className="max-h-3/4 overflow-y-auto"
        showCloseButton={false}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit({
              pocketbase,
              id: searchQuery.selected?.[0],
              navigate,
            });
          }}
        >
          <form.AppForm>
            <Component
              form={form as any}
              action={searchQuery.action === 'create' ? 'create' : 'update'}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PocketbaseForms;
