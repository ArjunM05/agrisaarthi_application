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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get user ID from localStorage
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");

    // Add minimal styles for Botpress integration
    const style = document.createElement("style");
    style.textContent = `
      /* Hide the default Botpress FAB */
      .bpFab {
        display: none !important;
      }

      /* Ensure the webchat container is visible */
      #webchat {
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        width: 400px !important;
        height: 500px !important;
        z-index: 9999 !important;
        display: block !important;
      }

      /* Make sure the webchat content is visible */
      #webchat .bpWebchat {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        max-width: 100% !important;
        display: block !important;
      }

      /* Ensure the chat window is visible when opened */
      #webchat .bpWebchatWidget {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      /* Hide any duplicate close buttons */
      .webchat-close-btn {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Create webchat container with user-specific ID
    const webchatContainer = document.createElement("div");
    webchatContainer.id = `webchat-${userId || "anonymous"}`;
    webchatContainer.style.width = "400px";
    webchatContainer.style.height = "500px";
    webchatContainer.style.position = "fixed";
    webchatContainer.style.bottom = "90px";
    webchatContainer.style.right = "20px";
    webchatContainer.style.zIndex = "9999";
    document.body.appendChild(webchatContainer);

    // Load Botpress script
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
    script.async = true;
    script.onload = () => {
      console.log("Botpress script loaded");

      // Wait a bit for botpress to be available
      setTimeout(() => {
        if (window.botpress) {
          console.log("Initializing Botpress...");

          window.botpress.on("webchat:ready", () => {
            console.log("Botpress webchat ready");
            setIsInitialized(true);
          });

          window.botpress.init({
            botId: "374ea289-7ebc-4ac4-acc5-c1bcd6b5b52e",
            configuration: {
              version: "v1",
              website: {},
              email: {},
              phone: {},
              termsOfService: {},
              privacyPolicy: {},
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
            clientId: "1712137a-bd8c-48a9-8534-d559d648bcd2",
            selector: `#webchat-${userId || "anonymous"}`,
            // Add user-specific session data
            sessionId: userId ? `user-${userId}` : `anonymous-${Date.now()}`,
            // Add user information to the session
            user: {
              id: userId || "anonymous",
              name: userName || "Guest",
            },
          });
        } else {
          console.error("Botpress not available");
        }
      }, 1000);
    };
    script.onerror = () => {
      console.error("Failed to load Botpress script");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        'script[src*="botpress.cloud/webchat/v3.0/inject.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
      const existingContainer = document.getElementById(
        `webchat-${userId || "anonymous"}`
      );
      if (existingContainer) {
        existingContainer.remove();
      }
    };
  }, []);

  const toggleChat = () => {
    console.log("Toggling chat...");
    console.log("Botpress available:", !!window.botpress);
    if (window.botpress) {
      try {
        if (isOpen) {
          window.botpress.close();
          setIsOpen(false);
          console.log("Chat closed");
        } else {
          window.botpress.open();
          setIsOpen(true);
          console.log("Chat opened successfully");

          // Force show the webchat container
          const userId = localStorage.getItem("user_id");
          const webchatContainer = document.getElementById(
            `webchat-${userId || "anonymous"}`
          );
          if (webchatContainer) {
            webchatContainer.style.display = "block";
            webchatContainer.style.visibility = "visible";
            webchatContainer.style.opacity = "1";
          }
        }
      } catch (error) {
        console.error("Error toggling chat:", error);
      }
    } else {
      console.error("Botpress not available");
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
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
    </div>
  );
};

export default ChatBot;
