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
import axios from 'axios';
import { SSE } from 'sse';
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
  let  apiKey=  "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";
  useEffect(()=>{
    resultRef.current = output;
  } , [output]);


  const handleInputChange = (event)=>{
      SetInput(event.target.value);
      // console.log(input);
  }
  const handleSendChat = ()=>{

    const parameterObject = {
      inputs:input
      }
      
      // const response =  new SSE("https://api.openai.com/v1/chat/completions",
      // {
      //     model:"gpt-3.5-turbo",
      //     messages:[{"role":"user","content":input}]
      //        },
          
      //     { headers:{
      //       "Authorization":"Bearer"+" "+"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"},
      //     },{method:"POST"})

      //     response.addEventListener("message",(e)=>{
      //       if(e.data != "[DONE]"){
      //         let payload = JSON.parse(e.data);
      //         let text = payload.choices[0].message.content.toString();
      //         if(text != "\n"){
      //           resultRef.current = resultRef.current + text;
      //           SetOutput(resultRef.current);
      //         }
      //       }else{
      //         response.close();
      //       }
      //     });
      //     response.stream();
      //     // const outputs = response.data.choices[0].message.content.toString();
         
          

      //     // SetOutput(outputs);
      //   }
      // const response = await chatgpt(parameterObject);
      SetOutput("");
      let url = "https://api.openai.com/v1/chat/completions";
      let data = {
          model: "gpt-4",
          prompt: input,
          temperature: 0.75,
          top_p: 0.95,
          max_tokens:2000,
          stream: true,
          n: 1,
      };
      let source = new SSE(url,{
  
          headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
          },
          method: "POST",
          body: JSON.stringify(data),
      });
  
      source.addEventListener("message",(e)=>{
          if(e.data !== "[DONE]"){
              let payload = JSON.parse(e.data);
              let text = payload.choices[0].text;
              if(text !== "\n"){
                  resultRef.current = resultRef.current + text;
                  SetOutput(resultRef.current);
              }
          }else{
              source.close();
              SetInput("");
          }
  
      });
      source.stream();
    }
      
      // const response = chatgpt(parameterObject);
      // SetOutput(response);
      // }
      // catch(err){
      //     console.log(err)
      // }
    
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
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}