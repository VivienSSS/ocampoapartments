import type { ArrayElementWrapperProps } from '@autoform/react';
import { TrashIcon } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../card';
import { Item, ItemActions, ItemContent, ItemSeparator } from '../../item';

export const ArrayElementWrapper: React.FC<ArrayElementWrapperProps> = ({
  children,
  onRemove,
  index,
}) => {
  return (
    <Card>
      <CardContent>
        <Item>
          <ItemContent>
            <ItemActions className="justify-end">
              <Button
                onClick={onRemove}
                variant="ghost"
                size="sm"
                type="button"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </ItemActions>
            {children}
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
};
