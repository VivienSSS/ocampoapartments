import { useNavigate, useParams, useSearch } from '@tanstack/react-router';

import { AnnouncementForm } from './announcement';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const PocketbaseForms = () => {
  const pathParams = useParams({ from: '/dashboard/$collection' });
  const searchQuery = useSearch({ from: '/dashboard/$collection' });
  const navigate = useNavigate({ from: '/dashboard/$collection' });

  let FormComponent: React.ReactNode = null;

  // collection - announcements
  if (pathParams.collection === 'announcements') {
    FormComponent = <AnnouncementForm />;
  }

  return (
    <Dialog
      open={!!searchQuery.action}
      onOpenChange={() =>
        navigate({
          search: undefined,
        })
      }
    >
      <DialogContent>{FormComponent}</DialogContent>
    </Dialog>
  );
};

export default PocketbaseForms;
