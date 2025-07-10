// declare global {
//   interface Window {
//     botpressWebChat: any;
//   }
// }

// import { useEffect } from "react";

// const Chatbot = () => {
//   useEffect(() => {
//     const existingScript = document.getElementById("botpress-script");
//     if (existingScript) return;

//     const script = document.createElement("script");
//     script.id = "botpress-script";
//     script.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       window.botpressWebChat.init({
//         composerPlaceholder: "Ask AgriSaarthi...",
//         botId: "374ea289-7ebc-4ac4-acc5-c1bcd6b5b52e",
//         clientId: "1712137a-bd8c-48a9-8534-d559d648bcd2",
//         hostUrl: "https://cdn.botpress.cloud/webchat/v1",
//         messagingUrl: "https://messaging.botpress.cloud",
//         botName: "AgriBot",
//         showPoweredBy: false,
//         enableTranscriptDownload: true,
//       });
//     };
//   }, []);

//   return (
//     <div className="container my-4">
//       <h3>Welcome to AgriBot</h3>
//       <p>The assistant will appear in the bottom-right corner of this page.</p>
//     </div>
//   );
// };

// export default Chatbot;

// // // import { useEffect } from 'react';

// // // const Chatbot = () => {
// // // useEffect(() => {
// // // // Inject Botpress scripts only once
// // // const existingScript = document.getElementById('botpress-script');
// // // if (existingScript) return;
// // // const script = document.createElement('script');
// // // script.id = 'botpress-script';
// // // script.src = 'https://cdn.botpress.cloud/webchat/v0/inject.js';
// // // script.async = true;
// // // document.body.appendChild(script);

// // // script.onload = () => {
// // //   window.botpressWebChat.init({
// // //     composerPlaceholder: "Ask AgriSaarthi...",
// // //     botId: "374ea289-7ebc-4ac4-acc5-c1bcd6b5b52e",
// // //     clientId: "1712137a-bd8c-48a9-8534-d559d648bcd2",
// // //     hostUrl: "https://cdn.botpress.cloud/webchat/v0",
// // //     messagingUrl: "https://messaging.botpress.cloud",
// // //     botName: "AgriBot",
// // //     showPoweredBy: false,
// // //     enableTranscriptDownload: true
// // //   });
// // // };
// // // }, []);

// // // return (
// // // <div className="chatbot-container" style={{ padding: "2rem" }}>
// // // <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
// // // Welcome to AgriBot
// // // </h1>
// // // <p>The assistant will appear in the bottom-right corner of this page.</p>
// // // </div>
// // // );
// // // };

// // import { Fab, Webchat } from "@botpress/webchat";
// // import { useState } from "react";

// // function ChatBot() {
// //   const [isWebchatOpen, setIsWebchatOpen] = useState(false);
// //   const toggleWebchat = () => {
// //     setIsWebchatOpen((prevState) => !prevState);
// //   };
// //   return (
// //     <>
// //       <Webchat
// //         clientId="1712137a-bd8c-48a9-8534-d559d648bcd2" // Your client ID here
// //         style={{
// //           width: "400px",
// //           height: "600px",
// //           display: isWebchatOpen ? "flex" : "none",
// //           position: "fixed",
// //           bottom: "90px",
// //           right: "20px",
// //         }}
// //       />
// //       <Fab
// //         onClick={() => toggleWebchat()}
// //         style={{ position: "fixed", bottom: "20px", right: "20px" }}
// //       />
// //     </>
// //   );
// // }

// // export default ChatBot;

import { useState } from "react";
import { Webchat, Fab } from "@botpress/webchat";

const clientId = "1712137a-bd8c-48a9-8534-d559d648bcd2";

export default function Chat() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        bottom: 0,
        right: 0,
        alignItems: "flex-end",
        gap: "12px",
        padding: "24px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          marginTop: "12px",
          marginBottom: "72px",
          width: "350px",
          maxHeight: "500px",
          overflow: "scroll",
          borderRadius: "16px",
          backgroundColor: "#fff",
          transform: isWebchatOpen ? "scale(1)" : "scale(0)",
          transformOrigin: "bottom right",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {isWebchatOpen && (
          <Webchat
            clientId={clientId}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
      <Fab
        onClick={toggleWebchat}
        style={{ position: "absolute", bottom: "24px", right: "24px" }}
      />
    </div>
  );
}
