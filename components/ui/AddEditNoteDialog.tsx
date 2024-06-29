import { ICreateNodeSchema, createNoteZodSchema } from "@/lib/validate/note";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import LoadingButton from "./loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}
const AddEditNoteDialog = ({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<ICreateNodeSchema>({
    resolver: zodResolver(createNoteZodSchema),
    defaultValues: {
      content: noteToEdit?.content || "",
      title: noteToEdit?.title || "",
    },
  });
  const onSubmit = async (input: ICreateNodeSchema) => {
    try {
      if (noteToEdit?.title) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ ...input, id: noteToEdit.id }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something is not right");
    }
  };
  const deleteNote = async () => {
    if (!noteToEdit?.id) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit?.id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something is not right");
    } finally {
      setDeleteInProgress(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {noteToEdit?.title ? "Edit note" : "Add note"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note title</FormLabel>
                    <FormControl>
                      <Input placeholder="Note title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Note content..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-1 sm:gap-0">
                {noteToEdit?.id && (
                  <LoadingButton
                    variant={"destructive"}
                    loading={deleteInProgress}
                    disabled={form.formState.isSubmitting}
                    onClick={deleteNote}
                    type="button"
                  >
                    {" "}
                    Delete note
                  </LoadingButton>
                )}
                <LoadingButton
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={form.formState.isSubmitting}
                >
                  Submit
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddEditNoteDialog;
