import SingleNoteComponent from "@/components/ui/single-note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) throw Error("User not available");
  const allNotes = await prisma.note.findMany({
    where: {
      userId,
    },
  });
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allNotes.map((note) => (
          <SingleNoteComponent note={note} key={note.id} />
        ))}
        {allNotes.length === 0 && (
          <div className="col-span-full text-center">
            {"You don't have any notes yet. Why don't you create one"}
          </div>
        )}
      </div>
    </>
  );
};

export default NotesPage;
