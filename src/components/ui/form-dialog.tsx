import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const FormDialog = (props: React.ComponentProps<'form'> & React.ComponentProps<typeof DialogPrimitive.Root> & {
  title?: React.ReactNode,
  description?: React.ReactNode
  children?: React.ReactNode
}) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange} defaultOpen={props.defaultOpen} modal={props.modal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>
            {props.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation()
          props.onSubmit?.(e)
        }} className={props.className}>
          {props.children}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog