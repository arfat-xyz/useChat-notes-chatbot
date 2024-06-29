/* eslint-disable react/no-children-prop */
import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, Trash, XCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Input } from "./input";
import { Button } from "./button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
interface AiChatbotProps {
  open: boolean;
  onClose: () => void;
}
const AiChatbot = ({ onClose, open }: AiChatbotProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    api: `/api/chat`,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);
  const lastMessageUser = messages[messages.length - 1]?.role === "user";
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[400px] p-1 xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] max-h-[80vh] flex-col rounded border bg-background shadow-xl">
        <div className="h-full mt-3 px-3 overflow-y-auto" ref={scrollRef}>
          {messages.map((singleMessage) => (
            <CHatMessage message={singleMessage} key={singleMessage.id} />
          ))}
          {isLoading && lastMessageUser && (
            <CHatMessage
              message={{ content: "Thinking...", role: "assistant" }}
            />
          )}
          {!isLoading && error && (
            <CHatMessage
              message={{
                content: "Something went wrong. Please try again",
                role: "assistant",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              Ask the AI a question about your notes
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="Clear chat"
            variant={"outline"}
            size={"icon"}
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Do something"
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

export default AiChatbot;
const CHatMessage = ({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) => {
  const { user } = useUser();
  const isAiMessage = role === "assistant";

  return (
    <>
      <div
        className={cn(
          "mb-3 flex items-center",
          isAiMessage ? "me-5 justify-start" : "ms-5 justify-end"
        )}
      >
        {isAiMessage && <Bot className="mr-2 shrink-0" />}
        <p
          className={cn(
            "whitespace-pre-line rounded-md border px-3 py-2",
            isAiMessage ? "bg-background" : "bg-primary text-primary-foreground"
          )}
        >
          <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
        </p>
        {!isAiMessage && user?.imageUrl && (
          <Image
            src={user.imageUrl}
            alt="User image"
            width={100}
            height={100}
            className="ml-2 rounded-full w-10 h-10 object-cover"
          />
        )}
      </div>
    </>
  );
};
