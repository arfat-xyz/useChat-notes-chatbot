"use client";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { exporterConfig } from "@/lib/image-export";
import { useState } from "react";
import AddEditNoteDialog from "@/components/ui/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import AiChatboButton from "@/components/ui/ai-chatbot-button";

const NotesNavbar = () => {
  const { theme, setTheme } = useTheme();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href={"/notes"} className="flex items-center gap-1">
            <Image
              src={exporterConfig.logo}
              alt="Todvob personal"
              width={30}
              height={40}
            />
            <span className="font-bold">todvob</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: { width: "2.5rem", height: "2.5rem" },
                },
              }}
            />
            <ThemeToggleButton />
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
            <AiChatboButton />
          </div>
        </div>
      </div>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
};

export default NotesNavbar;
