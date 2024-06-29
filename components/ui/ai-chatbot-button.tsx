import React, { useState } from "react";
import { Button } from "./button";
import { Bot } from "lucide-react";
import AiChatbot from "./ai-chatbox";

const AiChatboButton = () => {
  const [chatboxOpen, setChatboxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setChatboxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <AiChatbot open={chatboxOpen} onClose={() => setChatboxOpen(false)} />
    </>
  );
};

export default AiChatboButton;
