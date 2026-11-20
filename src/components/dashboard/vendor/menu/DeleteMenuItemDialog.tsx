// Save as: src/components/vendor/DeleteMenuItemDialog.tsx
'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
// import { deleteMenuItemAction } from '@/app/(dashboard)/dashboard/vendor/menu/actions'

type DeleteMenuItemDialogProps = {
  item: { id: string; name: string }
}

const DeleteMenuItemDialog = ({ item }: DeleteMenuItemDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
    //   const result = await deleteMenuItemAction(item.id)

    //   if (!result.ok) {
    //     toast.error('Could not delete item', { description: result.error })
    //     return
    //   }

      toast.success('Item deleted', { description: `${item.name} was removed from your menu.` })
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            aria-label={`Delete ${item.name}`}
            className="h-9 flex-1 gap-1.5 rounded-full border-[#E3A59F] bg-transparent text-[0.875rem] text-[#B42318] hover:bg-red-50 hover:text-[#B42318]"
          />
        }
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent className="border-0 bg-[#FBF6EF] font-sans text-[#3B2417]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
            Delete this item?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[0.8125rem] text-[#7A6455]">
            “{item.name}” will be removed from your menu for good. This can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="border-[#EADBC8] bg-[#F5EDE3]">
          <AlertDialogCancel
            disabled={isPending}
            className="h-10 rounded-full border-[#EADBC8] bg-transparent px-5 text-[#3B2417]"
          >
            Keep item
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 gap-2 rounded-full bg-[#B42318] px-5 text-white hover:bg-[#8F1B12]"
          >
            {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isPending ? 'Deleting…' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteMenuItemDialog