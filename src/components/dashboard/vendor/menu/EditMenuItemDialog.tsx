// Save as: src/components/vendor/EditMenuItemDialog.tsx
'use client'

import { useState, useTransition } from 'react'
import { Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { inputClass, labelClass } from '@/components/auth/field-styles'
// import { updateMenuItemAction } from '@/app/(dashboard)/dashboard/vendor/menu/actions'

type EditMenuItemDialogProps = {
  item: { id: string; name: string; description: string; price: number }
}

const EditMenuItemDialog = ({ item }: EditMenuItemDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
    //   const result = await updateMenuItemAction(item.id, {
    //     name: String(form.get('name') ?? ''),
    //     description: String(form.get('description') ?? ''),
    //     price: Number(form.get('price')),
    //   })

    //   if (!result.ok) {
    //     toast.error('Could not save changes', { description: result.error })
    //     return
    //   }

      toast.success('Item updated', { description: `${item.name} has been saved.` })
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-9 flex-1 gap-1.5 rounded-full border-[#3B2417] bg-transparent text-[0.875rem] text-[#3B2417] hover:bg-[#3B2417] hover:text-[#F5EDE3]"
          />
        }
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Edit
      </DialogTrigger>

      <DialogContent className="border-0 bg-[#FBF6EF] p-5 font-sans text-[#3B2417] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[1.5rem] uppercase leading-none tracking-tight text-[#7A2E12]">
            Edit item
          </DialogTitle>
          <DialogDescription className="text-[0.8125rem] text-[#7A6455]">
            Update what customers see on your menu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`name-${item.id}`} className={labelClass}>Name</Label>
            <Input
              id={`name-${item.id}`}
              name="name"
              defaultValue={item.name}
              disabled={isPending}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`desc-${item.id}`} className={labelClass}>Description</Label>
            <Textarea
              id={`desc-${item.id}`}
              name="description"
              defaultValue={item.description}
              disabled={isPending}
              className={`${inputClass} h-auto min-h-24 py-2.5`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`price-${item.id}`} className={labelClass}>Price ($)</Label>
            <Input
              id={`price-${item.id}`}
              name="price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              defaultValue={item.price}
              disabled={isPending}
              className={inputClass}
            />
          </div>

          <DialogFooter className="-mx-5 -mb-5 border-[#EADBC8] bg-[#F5EDE3] px-5 py-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="h-10 rounded-full border-[#EADBC8] bg-transparent px-5 text-[#3B2417]"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 gap-2 rounded-full bg-[#3B2417] px-5 text-[#F5EDE3] hover:bg-[#2A1A10]"
            >
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditMenuItemDialog