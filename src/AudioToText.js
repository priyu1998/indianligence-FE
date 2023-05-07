
  import  Checkbox  from "@mui/material/Checkbox";
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
    const silenceTimeoutRef = useRef();
    const [checked , setChecked] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [checkboxes, setCheckboxes] = useState([
      { name: "checkboxOne", label: "Checkbox One", checked: false, disabled: false },
      { name: "checkboxTwo", label: "Checkbox Two", checked: false, disabled: false },
      { name: "checkboxThree", label: "Checkbox Three", checked: false, disabled: false },
      
    ]);
    const [checkbox1 , setCheckbox1] = useState(false);
    const [checkbox2 , setCheckbox2] = useState(false);
    const [checkbox3 , setCheckbox3] = useState(false);
    const [language , setLanguage] = useState('en-us');
    const [checkbox1_disabled , setCheckbox1d ] = useState(false);

    const [checkbox2_disabled , setCheckbox2d ] = useState(false);

    const [checkbox3_disabled , setCheckbox3d ] = useState(false);
    // const speechRecognized = (data) => {
    //   if (data.final) {
    //     setCurrentRecognition("...");
    //     setRecognitionHistory((old) => [data.text, ...old]);
    //   } else setCurrentRecognition(data.text + "...");
    // };
   

      const handleCheckboxChange = (event) => {
        
        console.log(event.target.name);
        if(event.target.name === "b1"){
        if(event.target.checked === true){
          setCheckbox1(event.target.checked);

          setLanguage(event.target.value)
          setCheckbox2d(true);
          setCheckbox3d(true);
      } else{
        setCheckbox1(false);
        setLanguage(null)
        setCheckbox2d(false);
      setCheckbox3d(false);

      }
      setCheckbox2(false);
      setCheckbox3(false);
      
    }else if(event.target.name === "b2"){
      if(event.target.checked === true){
        setCheckbox2(event.target.checked);

        setLanguage(event.target.value)
        setCheckbox1d(true);
      setCheckbox3d(true);
    } else{
      setCheckbox2(false);
      setLanguage(null)
      setCheckbox1d(false);
      setCheckbox3d(false);

    }
    setCheckbox1(false);
    setCheckbox3(false);
    

    }else if(event.target.name === "b3"){
      if(event.target.checked === true){
        setCheckbox3(event.target.checked);

        setLanguage(event.target.value)
        setCheckbox1d(true);
    setCheckbox2d(true);
    } else{
      setCheckbox3(false);
      setLanguage(null)
      setCheckbox1d(false);
      setCheckbox2d(false);

    }
    setCheckbox1(false);
    setCheckbox2(false);
    

    }
        

      };
    
      const getCheckedValue = () => {
        const checkedCheckbox = checkboxes.find((checkbox) => checkbox.checked);
        return checkedCheckbox ? checkedCheckbox.name : "";
      };

  

    const connect = () => {
      console.log(language);

      connection?.disconnect();
      const socket = io.connect("https://chat.bharatgpt.world");
      socket.on("connect", () => {
        console.log("connected", socket.id);
        setConnection(socket);
      });
  
      socket.emit("send_message", language);
  
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
      clearTimeout(silenceTimeoutRef.current);
      connection?.emit("endGoogleCloudStream");
      connection?.disconnect();
      processorRef.current?.disconnect();
      audioInputRef.current?.disconnect();
      audioContextRef.current?.close();
      setConnection(undefined);
      setRecorder(undefined);
      setIsRecording(false);
    };

    const handleSilenceDetection = () => {
      if (isRecording) {
        disconnect();
        props.handleSendChat(true);
      }
    };

    
    useEffect(() => {
      if (isRecording) {
        silenceTimeoutRef.current = setTimeout(handleSilenceDetection, 5000);
      }
    }, [isRecording]);

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
            connection.emit("send_audio_data", { language:language ,audio: audioData });
          };
          setIsRecording(true);
        } else {
          setIsRecording(false);
          setRecorder(undefined);
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
        {/* <Container className="py-5 text-center"> */}
          <Container  fluid className="py-0  text-light text-center " style={{marginLeft:"0px" ,padding:0}}>
            <Container sm={10} xs={10} md={10} lg={10} style={{padding:0}}>
              <Button
                className={isRecording ? "btn-danger" : "btn-outline-light"}
                onClick={connect}
                disabled={isRecording}
                style={{marginLeft:"0.5em", marginRight:"0.5em"}}
              >
                Speak
              </Button>

              {/* <Button style={{marginLeft:"0.5em", marginRight:"0.5em"}}
                className="btn-outline-dark"
                onClick={disconnect}
                disabled={!isRecording}
              >
                Stop
              </Button> */}
              {/* {checkboxes.map((checkbox) => (
          <label key={checkbox.name}> 
        <Checkbox
        name={checkbox.name}
      checked={checkboxes.checked}
      onChange={handleCheckboxChange}
      inputProps={{ "aria-label": "controlled" }}
      disabled={isDisabled}
    />
           {checkbox.label} 
          </label> 
       ))}  */}
              <label style={{color:"black"}}>en</label>
              <Checkbox   name="b1" checked={checkbox1} onChange={handleCheckboxChange} aria-label="English" value={"en-US"} disabled={checkbox1_disabled}>

              </Checkbox>
              <label style={{color:"black"}}>hi</label>
              <Checkbox  name="b2" checked={checkbox2} onChange={handleCheckboxChange} aria-label="Hindi" value={"hi-IN"} disabled={checkbox2_disabled}>

              </Checkbox>

          <label style={{color:"black"}}>kn</label>
              <Checkbox name="b3" checked={checkbox3} onChange={handleCheckboxChange} aria-label="Kannada" value={"kn-IN"} disabled={checkbox3_disabled}>

              </Checkbox>
            {/* </Container> */}
          </Container>
          {/* <Container className="py-5 text-center">
            {props.recognitionHistory?.map((tx, idx) => (
              <p key={idx}>{tx}</p>
            ))}
            <p>{props?.currentRecognition}</p>
          </Container> */}
        </Container>
      </React.Fragment>
    );
  };
  
  export default AudioToText;
  
    