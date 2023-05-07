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
import { useState, useEffect, useRef } from 'react';
import { chatgpt } from '../api/Chatapi';
import { Speech } from 'react-speech';
import axios from 'axios';
import { SSE } from 'sse';
// import Transcription from '../mic';
import AudioToText from "../AudioToText"
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
        <Box sx={{ p: 1 }}>
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
  const [input, SetInput] = useState(null);
  const [output, SetOutput] = useState(null);
  const resultRef = useRef();
  // const scrollRef = useRef(null);
  const [audio, Setaudio] = useState(null)
  // const [audioUrl, setAudioUrl] = useState([]);
  const [currentRecognition, setCurrentRecognition] = useState();
  const [recognitionHistory, setRecognitionHistory] = useState([]);
  const [question, setQuestion] = useState(false);
  let apiKey = "#########";
  useEffect(() => {
    resultRef.current = output;

  }, [output]);

  useEffect(() => {
    if (question) {
      handleSendChat();
    }
    setQuestion(false)
  }, [question]);

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
  const handleInputChange = (event) => {
    SetInput(event.target.value);
  
  }


  const talk = new SpeechSynthesisUtterance();
  // talk.voice = "Google UK English Female";
  talk.rate = "1";
  const handleSendChat = () => {
    <Speech text="text is nothing like you"
      pitch="1"
      volume="1"
      lang="en-GB"
      voice="Google UK English Female"
    />
    const parameterObject = {
      inputs: input
    }

    SetOutput("");
    //   let url = "https://api.openai.com/v1/completions";
    let url = "https://api.openai.com/v1/chat/completions";

    let data = {
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": input }],
      temperature: 0.75,
      top_p: 0.95,
      max_tokens: 1000,
      stream: true,
      n: 1,
    };
    let source = new SSE(url, {

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },

      method: "POST",
      payload: JSON.stringify(data),
    })
    source.addEventListener("message", (e) => {
      if (e.data !== "[DONE]") {
        let payload = JSON.parse(e.data);

        let text = payload.choices[0].delta.content;
        if (payload.choices[0].finish_reason !== "stop") {

          if (text !== undefined) {
            if (payload.choices[0].delta != " ") {

              talk.text = resultRef.current;
              resultRef.current = resultRef.current + text;
              SetOutput(resultRef.current);
            }
          }
        }
      } else {
        // resultRef.current = resultRef.current + "$$";
        // window.speechSynthesis.cancel();
        console.log("Final Output" + "\n" + resultRef.current)
        if (resultRef.current !== null) {

          const requestObjects = {
            text: resultRef.current,
            voice: "en-IN-Wavenet-C",
            language: "en-IN"
          }
          if (requestObjects !== null) {
            try {
              const speak = async (requestObjects) => {
                const res = await axios.post(`https://chat.bharatgpt.world/api/speak`, requestObjects,
                  {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                const data = res.data;
                Setaudio(data);
                const audio = new Audio(data.audioUrl);
                audio.play();

              }
              speak(requestObjects);
            } catch (error) {
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
  
    <div style={{
      // backgroundColor: "red",

      width: "100%", marginTop: "1%",
      marginLeft:0,marginRight:0,padding:0
    }}>

      
      {/* <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      > */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <BasicGrid output={output} onChange={handleInputChange} onsend={handleSendChat}
            setInputs={SetInput} inputs={input}
          />
      <AudioToText handleSendChat={setQuestion}
      SetInput={SetInput} 
      recognitionHistory={recognitionHistory}
      speechRecognized={speechRecognized}
       setCurrentRecognition={setCurrentRecognition}
        currentRecognition={currentRecognition} />


        </TabPanel>
        {/* <TabPanel value={value} index={1} dir={theme.direction}>

          <MultilineTextFields

            onChange={handleInputChange} onsend={handleSendChat}
            setInputs={SetInput} inputs={input}
            sx={{
              borderRadius: "7px", backgroundColor: "blue",
              bottom: 0,
              position: 'fixed',
              width: '100%',
              left: 0
            }}>
          </MultilineTextFields>
          <AudioToText handleSendChat={setQuestion} SetInput={SetInput} recognitionHistory={recognitionHistory} speechRecognized={speechRecognized} setCurrentRecognition={setCurrentRecognition} currentRecognition={currentRecognition} />

        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Coming Soon
        </TabPanel> */}
      {/* </SwipeableViews> */}
    </div>
  );
}