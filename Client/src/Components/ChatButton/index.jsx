import { useSelector } from "react-redux";
import React, { useState } from "react";

export const FloatingChatBtn = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen ? (
        <div></div>
      ) : (
        <button className="floating-chatbtn">
          <img
            className="floating-chat-icon"
            src="https://upload.convolab.ai/convolab/images/convolab-chaticon-2.svg"
          />
        </button>
      )}
    </div>
  );
};
