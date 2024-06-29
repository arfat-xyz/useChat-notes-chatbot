"use client";
import { Note as NoteModel } from "@prisma/client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import AddEditNoteDialog from "./AddEditNoteDialog";
interface SingleNoteComponentProps {
  note: NoteModel;
}
const SingleNoteComponent = ({ note }: SingleNoteComponentProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg hover:dark:shadow-white hover:dark:shadow-sm"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardDescription className="pl-6">
          {createdUpdatedAtTimestamp}
          {wasUpdated && " (updated)"}
        </CardDescription>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      <AddEditNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default SingleNoteComponent;
