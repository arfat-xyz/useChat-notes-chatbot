import React from "react";
import NotesNavbar from "./navbar";

const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NotesNavbar />
      <main className="max-w-7xl m-auto p-4">{children}</main>
    </>
  );
};

export default NotesLayout;
