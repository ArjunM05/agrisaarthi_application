// import { useState } from 'react';
// import {Webchat, WebchatProvider,Fab,getClient,Configuration,} from '@botpress/webchat';

// const botId = '374ea289-7ebc-4ac4-acc5-c1bcd6b5b52e';
// const clientId = '1712137a-bd8c-48a9-8534-d559d648bcd2';

// const configuration: Configuration = {
// botName: 'AgriBot',
// color: '#008000', // optional green color
// composerPlaceholder: 'Ask AgriBot...',
// };

// export default function App() {
// const client = getClient({
// clientId,
// botId,
// });

// const [isWebchatOpen, setIsWebchatOpen] = useState(false);

// const toggleWebchat = () => {
// setIsWebchatOpen((prev) => !prev);
// };

// return (
// <div style={{ width: '100vw', height: '100vh' }}>
// <WebchatProvider client={client} configuration={configuration}>
// <Fab onClick={toggleWebchat} />
// {isWebchatOpen && <Webchat />}
// </WebchatProvider>
// </div>
// );
// }
