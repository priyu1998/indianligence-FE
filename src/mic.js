// import React, { useState } from 'react';
// import axios from 'axios';

// const SpeechRecognition = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcription, setTranscription] = useState('');

//   const handleRecord = async () => {
//     setIsRecording(true);
//     setTranscription('');

//     try {
//       await axios.post('http://localhost:3001/start');
//     } catch (error) {
//       console.error(error);
//       setIsRecording(false);
//     }
//   };

//   const handleStop = async () => {
//     try {
//       await axios.post('http://localhost:3001/stop');
//     } catch (error) {
//       console.error(error);
//     }

//     setIsRecording(false);
//   };

//   return (
//     <div>
//       <button onClick={handleRecord} disabled={isRecording}>
//         Speak
//       </button>
//       <button onClick={handleStop} disabled={!isRecording}>
//         Stop
//       </button>
//       <p>{transcription}</p>
//     </div>
//   );
// };

// export default SpeechRecognition;
