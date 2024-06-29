import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.svg";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const { userId } = auth();
if (userId) redirect("/notes");

const HomePage = () => {
  return (
    <>
      <main className="flex flex-col h-screen items-center justify-center gap-5">
        <div className="flex items-center gap-4">
          <Image src={logo} alt="Todvob arfat" width={60} height={100} />
          <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Todvob Arfat
          </span>
        </div>
        <p className="text-center max-w-prose">
          An intelligent note-taking app with AI integratino, build with OPENAI
          pinecone, Next.js, Shadcn UI, Clerk, and more
        </p>
        <Button asChild size={"lg"}>
          <Link href={"/notes"}>Open</Link>
        </Button>
      </main>
    </>
  );
};

export default HomePage;
