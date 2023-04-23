import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Button } from '@mui/material';
import {chatgpt} from '../api/Chatapi';


export default function MultilineTextFields(props) {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%',marginLeft:0 },
        position: props.position,
        bottom:5,
        left:0,
        width:'100%',
        display:"flex",
        paddingInline:"5px" }}
        noValidate
        autoComplete="off"
        
    >
        
      <div style={{marginRight:"5px", 
            // backgroundColor:"blue" , 
            width:"100%"}}>
        <TextField
          id="outlined-multiline-flexible"
          // label="Ask me anything !"
          multiline
          maxRows={4}
          value={props.inputs}
          onChange={props.onChange}
        />
         
      </div>
      <Button
        onClick={props.onsend}
        >
            Send</Button>
         </Box>
         
  );
}