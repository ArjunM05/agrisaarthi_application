// Declare global botpress object
declare global {
  interface Window {
    botpress: {
      on: (event: string, callback: () => void) => void;
      init: (config: any) => void;
      open: () => void;
      close: () => void;
    };
  }
}

import { useEffect, useState } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");

    // 🔁 New sessionId every time → clears history
    const sessionId = userId
      ? `user-${userId}-${Date.now()}`
      : `anon-${Date.now()}`;

    const style = document.createElement("style");
    style.textContent = `
      .bpFab { display: none !important; }
      #webchat {
        position: fixed !important;
        bottom: 100px !important;
        right: 20px !important;
        width: 400px !important;
        height: 500px !important;
        z-index: 9999 !important;
        display: none !important;
      }
      #webchat.show { display: block !important; }
      #webchat .bpWebchat,
      #webchat .bpWebchatWidget {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
      }
      .webchat-close-btn { display: none !important; }
    `;
    document.head.appendChild(style);

    const webchatContainer = document.createElement("div");
    webchatContainer.id = `webchat-${sessionId}`;
    webchatContainer.style.cssText = `
      width: 400px;
      height: 500px;
      position: fixed;
      bottom: 100px;
      right: 20px;
      z-index: 9999;
      display: none;
    `;
    document.body.appendChild(webchatContainer);

    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.botpress) {
          window.botpress.on("webchat:closed", () => {
            setIsOpen(false);
            const container = document.getElementById(`webchat-${sessionId}`);
            if (container) {
              (container as HTMLElement).style.display = "none";
              container.classList.remove("show");
            }
          });

          window.botpress.init({
            botId: "374ea289-7ebc-4ac4-acc5-c1bcd6b5b52e",
            clientId: "1712137a-bd8c-48a9-8534-d559d648bcd2",
            selector: `#webchat-${sessionId}`,
            sessionId: sessionId,
            user: {
              id: userId || sessionId,
              name: userName || "Guest",
            },
            configuration: {
              version: "v1",
              color: "#28a745",
              variant: "solid",
              headerVariant: "solid",
              themeMode: "light",
              fontFamily: "inter",
              radius: 4,
              feedbackEnabled: true,
              footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
              allowFileUpload: true,
              botName: "AgriBot",
            },
          });
        }
      }, 1000);
    };
    script.onerror = () => console.error("Failed to load Botpress script");
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src*="botpress.cloud/webchat/v3.0/inject.js"]'
      );
      if (existingScript) existingScript.remove();
      const existingContainer = document.getElementById(`webchat-${sessionId}`);
      if (existingContainer) existingContainer.remove();
    };
  }, []);

  const toggleChat = () => {
    const containers = document.querySelectorAll('[id^="webchat-"]');
    const container = containers[containers.length - 1]; // Use most recent container
    if (window.botpress) {
      if (isOpen) {
        window.botpress.close();
        setIsOpen(false);
        if (container) {
          container.classList.remove("show");
          (container as HTMLElement).style.display = "none";
        }
      } else {
        window.botpress.open();
        setIsOpen(true);
        if (container) {
          (container as HTMLElement).style.display = "block";
          container.classList.add("show");
        }
      }
    }
  };

  return (
    <div
      className="position-fixed p-3"
      style={{
        zIndex: 1000,
        bottom: "20px",
        right: "20px",
        pointerEvents: "auto",
      }}
    >
      <div
        className="bg-success rounded-circle d-flex align-items-center justify-content-center shadow"
        style={{
          width: "60px",
          height: "60px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }}
        onClick={toggleChat}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
          style={{ width: "24px", height: "24px" }}
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </div>
      <div 
        className="text-center mt-2 text-success fw-bold"
        style={{ 
          fontSize: "12px", 
          whiteSpace: "nowrap",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          cursor: "pointer"
        }}
        onClick={toggleChat}
      >
        Chat with Agribot
      </div>
    </div>
  );
};

export default ChatBot;
