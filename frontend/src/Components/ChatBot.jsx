import { useEffect } from 'react';

const Chatbot = () => {
useEffect(() => {
// Inject Botpress scripts only once
const existingScript = document.getElementById('botpress-script');
if (existingScript) return;
const script = document.createElement('script');
script.id = 'botpress-script';
script.src = 'https://cdn.botpress.cloud/webchat/v0/inject.js';
script.async = true;
document.body.appendChild(script);

script.onload = () => {
  window.botpressWebChat.init({
    composerPlaceholder: "Ask AgriSaarthi...",
    botId: "374ea289-7ebc-4ac4-acc5-c1bcd6b5b52e",
    clientId: "1712137a-bd8c-48a9-8534-d559d648bcd2",
    hostUrl: "https://cdn.botpress.cloud/webchat/v0",
    messagingUrl: "https://messaging.botpress.cloud",
    botName: "AgriBot",
    showPoweredBy: false,
    enableTranscriptDownload: true
  });
};
}, []);

return (
<div className="chatbot-container" style={{ padding: "2rem" }}>
<h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
Welcome to AgriBot
</h1>
<p>The assistant will appear in the bottom-right corner of this page.</p>
</div>
);
};
