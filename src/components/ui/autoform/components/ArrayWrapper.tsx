import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { ArrayWrapperProps } from "@autoform/react";
import { Item, ItemActions, ItemContent, ItemGroup } from "../../item";

export const ArrayWrapper: React.FC<ArrayWrapperProps> = ({
  label,
  children,
  onAddItem,
}) => {
  return (
    <ItemGroup className="space-y-4">
      <h3 className="text-lg font-medium">{label}</h3>
      {children}
      <Button onClick={onAddItem} variant="outline" size="sm" type="button">
        <PlusIcon className="h-4 w-4" />
      </Button>
    </ItemGroup>
  );
};
