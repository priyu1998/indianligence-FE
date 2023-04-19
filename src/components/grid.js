import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { margin, padding, positions, width } from '@mui/system';
import MultilineTextFields from './input';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid(props) {
  return (
    <Box sx={{ flexGrow: 1 }} position={'relative'}>
      <Grid container spacing={2} >
      
        <Grid  lg={10} md={50} sm={10} height={500}  position={'relative'}
          sx={{backgroundColor:"white"}}>
          <p style={{ display:"flex",
          fontFamily:"Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
          fontSize:"16px",
          justifyContent:"left",
          alignItems:"left",
          textAlign:"left",
          margin:0, left:0,
          maxHeight:"85%",
          scrollBehavior:"auto",
          overflow:"auto",
          scrollbarGutter:"auto",
          // backgroundColor:"red",
          whiteSpace:"pre-wrap"}}
            >
            {props.output}
            </p>
          <MultilineTextFields  
          
          position={"absolute"} onChange={props.onChange} onsend={props.onsend}
          setInputs={props.SetInputs} inputs={props.inputs}
          sx={{borderRadius:"7px" , 
          bottom:0,
          position:'fixed',
          width:'100%',
          left:0
          }}>
           </MultilineTextFields>
        </Grid>
        <Grid sm={10} md={50} lg={2}>
            {/* <Item>
              <Box
                id="category-a"
                sx={{ fontSize: '12px', textTransform: 'uppercase' }}
              >
                Select Parameters
              </Box>
              <Box component="ul" aria-labelledby="category-a" sx={{ pl: 2 }}>
                <li>A</li>
                <li>B</li>
                <li>C</li>
              </Box>
            </Item> */}
          </Grid>

        {/* <Grid xs={2}>
          <Item>xs=4</Item>
        </Grid> */}
      </Grid>
    </Box>
  );
}