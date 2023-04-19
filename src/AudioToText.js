

  // /* eslint-disable react-hooks/exhaustive-deps */
  // import React, { useEffect, useState, useRef } from "react";
  // // import { Button } from "react-bootstrap";
  // // import Container from "react-bootstrap/Container";
  // import * as io from "socket.io-client";
  
  // const sampleRate = 16000;
  
  // const getMediaStream = () =>
  //   navigator.mediaDevices.getUserMedia({
  //     audio: {
  //       deviceId: "default",
  //       sampleRate: sampleRate,
  //       sampleSize: 16,
  //       channelCount: 1,
  //     },
  //     video: false,
  //   });
  
  // const AudioToText = () => {
  //   const [connection, setConnection] = useState();
  //   const [currentRecognition, setCurrentRecognition] = useState("");
  //   const [recognitionHistory, setRecognitionHistory] = useState([""]);
  //   const [isRecording, setIsRecording] = useState(false);
  //   const [recorder, setRecorder] = useState();
  //   const processorRef = useRef();
  //   const audioContextRef = useRef();
  //   const audioInputRef = useRef();
  
  //   const speechRecognized = (data) => {
  //     if (data.final) {
  //       setCurrentRecognition("...");
  //       setRecognitionHistory((old) => [data.text, ...old]);
  //     } else setCurrentRecognition(data.text + "...");
  //   };
  
  //   const connect = () => {
  //     connection?.disconnect();
  //     const socket = io.connect("http://localhost:8081");
  //     socket.on("connect", () => {
  //       console.log("connected", socket.id);
  //       setConnection(socket);
  //     });
  //     socket.emit("send_message", "hello world");
  
  //     socket.emit("startGoogleCloudStream");
  
  //     socket.on("receive_message", (data) => {
  //       console.log("received message", data);
  //     });
  
  //     socket.on("receive_audio_text", (data) => {
  //       speechRecognized(data);
  //       console.log("received audio text", data);
  //     });
  
  //     socket.on("disconnect", () => {
  //       console.log("disconnected", socket.id);
  //     });
  //   };
  
  //   const disconnect = () => {
  //     if (!connection) return;
  //     connection?.emit("endGoogleCloudStream");
  //     connection?.disconnect();
  //     processorRef.current?.disconnect();
  //     audioInputRef.current?.disconnect();
  //     audioContextRef.current?.close();
  //     setConnection(undefined);
  //     setRecorder(undefined);
  //     setIsRecording(false);
  //   };
  
  //   useEffect(() => {
  //     (async () => {
  //       if (connection && isRecording) {
  //         return;
  //       }
  
  //       const stream = await getMediaStream();
  
  //       audioContextRef.current = new window.AudioContext();
  
  //       await audioContextRef.current.audioWorklet.addModule(
  //         "/src/worklets/recorderWorkletProcessor.js"
  //       );
  
  //       audioContextRef.current.resume();
  
  //       audioInputRef.current =
  //         audioContextRef.current.createMediaStreamSource(stream);
  
  //       processorRef.current = new AudioWorkletNode(
  //         audioContextRef.current,
  //         "recorder.worklet"
  //       );
  
  //       processorRef.current.connect(audioContextRef.current.destination);
  //       audioContextRef.current.resume();
  
  //       audioInputRef.current.connect(processorRef.current);
  
  //       processorRef.current.port.onmessage = (event) => {
  //         const audioData = event.data;
  //         connection.emit("send_audio_data", { audio: audioData });
  //       };
  //     })();
  
  //     return () => {
  //       if (isRecording) {
  //         processorRef.current?.disconnect();
  //         audioInputRef.current?.disconnect();
  //       }
  //     };
  //   }, [connection, isRecording,recorder]);
  
  //   useEffect(() => {
  //     return () => {
  //       disconnect();
  //     };
  //   }, []);
  
  //   return (
  //     // JSX component code
  
  //       <div className="py-5 text-center">
  //         <div fluid className="py-5 bg-primary text-light text-center ">
  //           <div>
  //             <button
  //               className={isRecording ? "btn-danger" : "btn-outline-light"}
  //               onClick={connect}
  //               disabled={isRecording}
  //             >
  //               Start
  //             </button>
  //             <button
  //               className="btn-outline-light"
  //               onClick={disconnect}
  //               disabled={!isRecording}
  //             >
  //               Stop
  //             </button>
  //           </div>
  //         </div>
  //         <div className="py-5 text-center">
  //           {recognitionHistory.map((tx, idx) => (
  //             <p key={idx}>{tx}</p>
  //           ))}
  //           <p>{currentRecognition}</p>
  //         </div>
  //       </div>
  //   );
  // };
  
  // export default AudioToText;

  /* eslint-disable react-hooks/exhaustive-deps */
  import { default as React, useEffect, useState, useRef } from "react";
  import { Button } from "react-bootstrap";
  import Container from "react-bootstrap/Container";
  import * as io from "socket.io-client";
  
  const sampleRate = 16000;
  
  const getMediaStream = () =>
    navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: "default",
        sampleRate: sampleRate,
        sampleSize: 16,
        channelCount: 1,
      },
      video: false,
    });
  
  const WordRecognized  = {
    final: Boolean,
    text: String,
  }
  
  const AudioToText = (props) => {
    const [connection, setConnection] = useState();
    // const [currentRecognition, setCurrentRecognition] = useState();
    // const [recognitionHistory, setRecognitionHistory] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState();
    const processorRef = useRef();
    const audioContextRef = useRef();
    const audioInputRef = useRef();
  
    // const speechRecognized = (data) => {
    //   if (data.final) {
    //     setCurrentRecognition("...");
    //     setRecognitionHistory((old) => [data.text, ...old]);
    //   } else setCurrentRecognition(data.text + "...");
    // };
  
    const connect = () => {
      connection?.disconnect();
      const socket = io.connect("http://localhost:8081");
      socket.on("connect", () => {
        console.log("connected", socket.id);
        setConnection(socket);
      });
  
      socket.emit("send_message", "hello world");
  
      socket.emit("startGoogleCloudStream");
  
      socket.on("receive_message", (data) => {
        console.log("received message", data);
      });
  
      socket.on("receive_audio_text", (data) => {
        props?.speechRecognized(data);
        console.log("received audio text", data);
      });
  
      socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
      });
    };
  
    const disconnect = () => {
      if (!connection) return;
      connection?.emit("endGoogleCloudStream");
      connection?.disconnect();
      processorRef.current?.disconnect();
      audioInputRef.current?.disconnect();
      audioContextRef.current?.close();
      setConnection(undefined);
      setRecorder(undefined);
      setIsRecording(false);
    };
  
    useEffect(() => {
      (async () => {
        if (connection) {
          if (isRecording) {
            return;
          }
  
          const stream = await getMediaStream();
  
          audioContextRef.current = new window.AudioContext();
  
          await audioContextRef.current.audioWorklet.addModule(
            "/src/worklets/recorderWorkletProcessor.js"
          );
  
          audioContextRef.current.resume();
  
          audioInputRef.current =
            audioContextRef.current.createMediaStreamSource(stream);
  
          processorRef.current = new AudioWorkletNode(
            audioContextRef.current,
            "recorder.worklet"
          );
  
          processorRef.current.connect(audioContextRef.current.destination);
          audioContextRef.current.resume();
  
          audioInputRef.current.connect(processorRef.current);
  
          processorRef.current.port.onmessage = (event) => {
            const audioData = event.data;
            connection.emit("send_audio_data", { audio: audioData });
          };
          setIsRecording(true);
        } else {
          console.error("No connection");
        }
      })();
      return () => {
        if (isRecording) {
          processorRef.current?.disconnect();
          audioInputRef.current?.disconnect();
          if (audioContextRef.current?.state !== "closed") {
            audioContextRef.current?.close();
          }
        }
      };
    }, [connection, isRecording, recorder]);
  
    return (
      <React.Fragment>
        <Container className="py-5 text-center">
          <Container fluid className="py-5 bg-primary text-light text-center ">
            <Container>
              <Button
                className={isRecording ? "btn-danger" : "btn-outline-light"}
                onClick={connect}
                disabled={isRecording}
              >
                Start
              </Button>
              <Button
                className="btn-outline-light"
                onClick={disconnect}
                disabled={!isRecording}
              >
                Stop
              </Button>
            </Container>
          </Container>
          <Container className="py-5 text-center">
            {props.recognitionHistory?.map((tx, idx) => (
              <p key={idx}>{tx}</p>
            ))}
            <p>{props?.currentRecognition}</p>
          </Container>
        </Container>
      </React.Fragment>
    );
  };
  
  export default AudioToText;
  
    