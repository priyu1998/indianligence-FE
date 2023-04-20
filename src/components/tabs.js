import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BasicGrid from './grid';
import { useState,useEffect,useRef } from 'react';
import { chatgpt } from '../api/Chatapi';
import {Speech} from 'react-speech';
import axios from 'axios';
import { SSE } from 'sse';
import MultilineTextFields from './input';
import { TextField } from '@mui/material';
import AudioToText from '../AudioToText';
// import Transcription from '../mic';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const [input ,SetInput] = useState(null);
  const [output , SetOutput] = useState(null);
  const resultRef = useRef();
  const scrollRef = useRef(null);
  const [audio,Setaudio] = useState(null)
  const [audioUrl, setAudioUrl] = useState([]);
  const [currentRecognition, setCurrentRecognition] = useState();
  const [recognitionHistory, setRecognitionHistory] = useState([]);
const [question , setQuestion] = useState(false);
  let  apiKey=  "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";
  useEffect(()=>{
    resultRef.current = output;

  } , [output]);

  useEffect(()=>{
    if(question){
    handleSendChat();
    }
    setQuestion(false)
  } , [question]);

  const speechRecognized = (data) => {
    
    SetInput(null);
    if (data.final) {
      
      setCurrentRecognition("...");
      SetInput("...");
      setRecognitionHistory((old) => [data.text, ...old]);
    } else {
      setCurrentRecognition(data.text + "...");
      SetInput(data.text + "...");

    }

  
  };
  const handleInputChange = (event)=>{
      SetInput(event.target.value);
      // setCurrentRecognition(null);
      // setQuestion(event.target.value);


      // console.log(input);
  }
  const talk = new SpeechSynthesisUtterance();
  // talk.voice = "Google UK English Female";
  talk.rate="1";

  // if(currentRecognition!=null){
  //   console.log("not null");
  //   Set(currentRecognition);
  // }
//  if(question===true){
//   const test = async()=>{
//   await handleSendChat();
//   }
//   test();
//   setQuestion(false);
//  }
  const handleSendChat = ()=>{
    <Speech text="text is nothing like you"
    pitch="1"
    volume="1"
    lang="en-GB"
    voice="Google UK English Female"
    />
    const parameterObject = {
      inputs:input
      }
     
      SetOutput("");
    //   let url = "https://api.openai.com/v1/completions";
    let url = "https://api.openai.com/v1/chat/completions";
  
    let data = {
      model:"gpt-3.5-turbo",
      messages:[{"role":"user","content":input}],
        temperature: 0.75,
        top_p: 0.95,
        max_tokens:4000,
        stream: true,
        n: 1,
    };
      let source = new SSE(url,{
  
    //       headers:{
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${apiKey}`,
    //       },
    //       method: "POST",
    //       payload: JSON.stringify(data),
    //   });
  
    headers : {
      "Content-Type": "application/json",
      Authorization:`Bearer ${apiKey}`
    },

    method:"POST",
    payload: JSON.stringify(data),
  })
      source.addEventListener("message",(e)=>{
          if(e.data !== "[DONE]"){
            // console.log(e.data)
              let payload = JSON.parse(e.data);
              
              let text = payload.choices[0].delta.content;
              // console.log(payload)
              if(payload.choices[0].finish_reason!=="stop"){

    // let text = texts.delta.content;
              if(text !== undefined){
                if(payload.choices[0].delta!= " "){

                  talk.text = resultRef.current;
                  resultRef.current = resultRef.current + text;
                  // if(talk.text!=="?"){
                  // window.speechSynthesis.speak(talk);
                  // }else{
                  //   window.speechSynthesis.cancel();
                  // }
                  SetOutput(resultRef.current);
              }
              }else{
                // talk.text = "else";
                // window.speechSynthesis.speak(talk);
                  // resultRef.current = resultRef.current + "%";
              }
                  // if(resultRef.current === "."){
                  //   console.log("done")
                  //   window.speechSynthesis.cancel();
                  // }
                }
          }else{
            // resultRef.current = resultRef.current + "$$";
            // window.speechSynthesis.cancel();
            console.log("Final Output"+"\n"+resultRef.current)
            if(resultRef.current!==null){ 

                const requestObjects = {
                 text : resultRef.current,
                 voice: "en-IN-Wavenet-C",
                 language: "en-IN" 
               }
               if(requestObjects!==null){
                 try{
                  const speak = async(requestObjects)=>{
                  const res =  await axios.post(`http://ai.ayuryoga.life/api/speak`,requestObjects,
                   {headers:{
                    'Content-Type': 'application/json'
                  } });
                  const data =  res.data;
                  Setaudio(data);
                  const audio = new Audio(data.audioUrl);
                  audio.play();

                 }
                 speak(requestObjects);
                }catch(error){
                   console.log(error);
                 }
               }
              
              
            }
            source.close();
              
              SetInput(" ");
          }

      },);
      source.stream();
    }
    

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    // <Box id="id" sx={{ bgcolor: 'background.paper', 
    // width:"sm",
    // marginY:5,
    
    // }}
    // >
    
    <div style={{backgroundColor:"whitesmoke" ,
    
    width:"100%",marginTop:"5%"}}>
         
      <AppBar position="relative" style={{marginTop:10 , width:"100%"}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="standard"
          aria-label="full width tabs example"
        >
          <Tab label="Q&A" {...a11yProps(0)} />
          <Tab label="Voice to Speech" {...a11yProps(1)} />
          <Tab label="Image Generation" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <BasicGrid output={output} onChange={handleInputChange} onsend={handleSendChat}
          setInputs={SetInput} inputs={input}
          />
         
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>

        <MultilineTextFields  
          
          onChange={handleInputChange} onsend={handleSendChat}
          setInputs={SetInput} inputs={input}
          sx={{borderRadius:"7px", backgroundColor:"blue" , 
          bottom:0,
          position:'fixed',
          width:'100%',
          left:0
          }}>
         </MultilineTextFields>
         <AudioToText handleSendChat={setQuestion} SetInput={SetInput} recognitionHistory={recognitionHistory} speechRecognized={speechRecognized} setCurrentRecognition={setCurrentRecognition} currentRecognition={currentRecognition}/>

        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Coming Soon
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}